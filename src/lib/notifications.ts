import { db } from "./prisma";
import { sendEmail } from "./email";
import { APP_URL } from "./constants";
import {
  bookingConfirmationEmail,
  bookingCancelledEmail,
  paymentReceiptEmail,
  welcomeEmail,
  bookingReminderEmail,
  reviewRequestEmail,
  adminNewBookingEmail,
  bankTransferConfirmationEmail,
  payAtPickupConfirmationEmail,
  paymentStatusUpdateEmail,
} from "./email-templates";
import { formatCurrency } from "./utils";

export type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

// Preference key mapping: notification type → preference field
const PREF_MAP: Record<string, string> = {
  booking: "bookingUpdates",
  payment: "paymentUpdates",
  review: "reviewRequests",
  system: "systemAlerts",
  admin: "adminNotifications",
};

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  link?: string;
  sendEmail?: boolean;
  email?: string;
  emailSubject?: string;
  emailHtml?: string;
  prefKey?: string; // preference category key to check
}

export async function createNotification(params: CreateNotificationParams) {
  const { type = "INFO", sendEmail: shouldEmail = false, prefKey, ...data } = params;

  // Check user preferences
  const prefs = await db.notificationPreference.findUnique({ where: { userId: data.userId } });
  if (prefs) {
    const prefField = prefKey ? PREF_MAP[prefKey] : null;
    if (prefField && !(prefs as Record<string, unknown>)[prefField]) {
      return null; // User opted out of this notification type
    }
  }

  const notification = await db.notification.create({
    data: {
      userId: data.userId,
      title: data.title,
      message: data.message,
      type,
      link: data.link,
    },
  });

  if (shouldEmail && data.email && data.emailSubject && data.emailHtml) {
    // Check email preferences for promotional
    if (prefKey === "marketing" && prefs && !prefs.promotionalEmails) {
      return notification;
    }
    await sendEmail({
      to: data.email,
      subject: data.emailSubject,
      html: data.emailHtml,
    });
  }

  return notification;
}

// ── Booking Notifications ──────────────────────

export async function notifyBookingConfirmed(booking: {
  id: string;
  bookingNumber: string;
  totalAmount: number;
  pickupDate: Date;
  returnDate: Date;
  userId: string;
  car: { name: string; brand: { name: string } };
  pickupLocation: { name: string };
  paymentMethod?: string | null;
}) {
  const user = await db.user.findUnique({ where: { id: booking.userId } });
  if (!user) return;

  const carName = `${booking.car.brand.name} ${booking.car.name}`;
  const dashboardUrl = `${APP_URL}/dashboard/bookings/${booking.id}`;

  let bankDetails = { bankName: "", accountHolder: "", iban: "", swiftCode: "", instructions: "" };
  if (booking.paymentMethod === "BANK_TRANSFER") {
    try {
      const setting = await db.setting.findFirst({
        where: { key: "bank_payment_settings", category: "PAYMENT" },
      });
      if (setting) bankDetails = JSON.parse(setting.value);
    } catch {}
  }

  await createNotification({
    userId: user.id,
    title: "Réservation confirmée",
    message: `Votre réservation #${booking.bookingNumber} pour ${carName} a été confirmée.`,
    type: "SUCCESS",
    link: dashboardUrl,
    prefKey: "booking",
    sendEmail: true,
    email: user.email,
    emailSubject: `DriveRent Maroc — Réservation #${booking.bookingNumber} confirmée`,
    emailHtml: booking.paymentMethod === "BANK_TRANSFER"
      ? bankTransferConfirmationEmail({
          customerName: user.firstName,
          bookingNumber: booking.bookingNumber,
          carName,
          pickupDate: booking.pickupDate.toISOString(),
          returnDate: booking.returnDate.toISOString(),
          pickupLocation: booking.pickupLocation.name,
          totalAmount: Number(booking.totalAmount),
          bankName: bankDetails.bankName || "Attijariwafa Bank",
          accountHolder: bankDetails.accountHolder || "AutoOS SARL",
          iban: bankDetails.iban || "",
          swiftCode: bankDetails.swiftCode || undefined,
          instructions: bankDetails.instructions || "Veuillez effectuer le virement en indiquant votre numéro de réservation dans le motif du paiement.",
          dashboardUrl,
        })
      : payAtPickupConfirmationEmail({
          customerName: user.firstName,
          bookingNumber: booking.bookingNumber,
          carName,
          pickupDate: booking.pickupDate.toISOString(),
          pickupLocation: booking.pickupLocation.name,
          totalAmount: Number(booking.totalAmount),
          dashboardUrl,
        }),
  });
}

export async function notifyBookingCancelled(booking: {
  id: string;
  bookingNumber: string;
  userId: string;
  car: { name: string; brand: { name: string } };
  reason?: string | null;
}) {
  const user = await db.user.findUnique({ where: { id: booking.userId } });
  if (!user) return;

  const carName = `${booking.car.brand.name} ${booking.car.name}`;

  await createNotification({
    userId: user.id,
    title: "Réservation annulée",
    message: `Votre réservation #${booking.bookingNumber} pour ${carName} a été annulée.`,
    type: "WARNING",
    link: `${APP_URL}/dashboard/bookings/${booking.id}`,
    prefKey: "booking",
    sendEmail: true,
    email: user.email,
    emailSubject: `DriveRent Maroc — Réservation #${booking.bookingNumber} annulée`,
    emailHtml: bookingCancelledEmail({
      customerName: user.firstName,
      bookingNumber: booking.bookingNumber,
      carName,
      reason: booking.reason || "",
    }),
  });
}

export async function notifyBookingActive(booking: {
  id: string;
  bookingNumber: string;
  userId: string;
  car: { name: string; brand: { name: string } };
}) {
  const user = await db.user.findUnique({ where: { id: booking.userId } });
  if (!user) return;

  await createNotification({
    userId: user.id,
    title: "Location démarrée",
    message: `Votre location du ${booking.car.brand.name} ${booking.car.name} (#${booking.bookingNumber}) est maintenant active. Profitez de votre trajet !`,
    type: "SUCCESS",
    link: `${APP_URL}/dashboard/bookings/${booking.id}`,
    prefKey: "booking",
  });
}

export async function notifyBookingCompleted(booking: {
  id: string;
  bookingNumber: string;
  userId: string;
  carId: string;
  car: { name: string; brand: { name: string } };
}) {
  const user = await db.user.findUnique({ where: { id: booking.userId } });
  if (!user) return;

  const carName = `${booking.car.brand.name} ${booking.car.name}`;

  await createNotification({
    userId: user.id,
    title: "Location terminée",
    message: `Votre location du ${carName} (#${booking.bookingNumber}) est terminée. Nous apprécions vos retours !`,
    type: "INFO",
    link: `${APP_URL}/cars/${booking.carId}`,
    prefKey: "review",
    sendEmail: true,
    email: user.email,
    emailSubject: `DriveRent Maroc — Comment s'est passée votre ${carName} ?`,
    emailHtml: reviewRequestEmail({
      customerName: user.firstName,
      carName,
      carUrl: `${APP_URL}/cars/${booking.carId}`,
    }),
  });
}

// ── Payment Notifications ──────────────────────

export async function notifyPaymentReceived(booking: {
  id: string;
  bookingNumber: string;
  userId: string;
  totalAmount: number;
}) {
  const user = await db.user.findUnique({ where: { id: booking.userId } });
  if (!user) return;

  const invoice = await db.invoice.findFirst({
    where: { bookingId: booking.id },
    orderBy: { createdAt: "desc" },
  });

  await createNotification({
    userId: user.id,
    title: "Paiement reçu",
    message: `Paiement de ${formatCurrency(Number(booking.totalAmount))} reçu pour la réservation #${booking.bookingNumber}.`,
    type: "SUCCESS",
    link: `${APP_URL}/dashboard/invoices`,
    prefKey: "payment",
    sendEmail: true,
    email: user.email,
    emailSubject: `DriveRent Maroc — Reçu de paiement pour #${booking.bookingNumber}`,
    emailHtml: paymentReceiptEmail({
      customerName: user.firstName,
      bookingNumber: booking.bookingNumber,
      amount: Number(booking.totalAmount),
      paymentDate: new Date().toISOString(),
      invoiceNumber: invoice?.invoiceNumber || "N/A",
      dashboardUrl: `${APP_URL}/dashboard/invoices`,
    }),
  });
}

// ── User Notifications ─────────────────────────

export async function notifyWelcome(user: { id: string; firstName: string; email: string }) {
  await createNotification({
    userId: user.id,
    title: "Bienvenue chez DriveRent Maroc !",
    message: `Bonjour ${user.firstName}, bienvenue chez DriveRent Maroc ! Parcourez notre flotte et effectuez votre première réservation.`,
    type: "SUCCESS",
    link: `${APP_URL}/cars`,
    sendEmail: true,
    email: user.email,
    emailSubject: "Bienvenue chez DriveRent Maroc — Votre expérience de location premium",
    emailHtml: welcomeEmail({
      customerName: user.firstName,
      dashboardUrl: `${APP_URL}/dashboard`,
    }),
  });
}

// ── Admin Notifications ────────────────────────

export async function notifyAdminNewBooking(booking: {
  bookingNumber: string;
  totalAmount: number;
  userId: string;
  car: { name: string; brand: { name: string } };
}) {
  const admins = await db.user.findMany({
    where: { role: { in: ["ADMIN", "SUPER_ADMIN", "MANAGER"] } },
  });

  const customer = await db.user.findUnique({ where: { id: booking.userId } });
  const carName = `${booking.car.brand.name} ${booking.car.name}`;

  for (const admin of admins) {
    await createNotification({
      userId: admin.id,
      title: "Nouvelle réservation",
      message: `Nouvelle réservation #${booking.bookingNumber} par ${customer?.firstName} ${customer?.lastName} pour ${carName}. Total : ${formatCurrency(Number(booking.totalAmount))}.`,
      type: "INFO",
      link: `${APP_URL}/admin/bookings`,
      prefKey: "admin",
    });
  }
}

export async function notifyPaymentStatusChanged(booking: {
  id: string;
  bookingNumber: string;
  userId: string;
  paymentStatus: string;
}) {
  const user = await db.user.findUnique({ where: { id: booking.userId } });
  if (!user) return;

  const statusLabels: Record<string, string> = {
    SUCCEEDED: "confirmé",
    FAILED: "échoué",
    AWAITING_TRANSFER: "en attente de virement",
    REFUNDED: "remboursé",
  };

  await createNotification({
    userId: user.id,
    title: `Paiement ${statusLabels[booking.paymentStatus] || booking.paymentStatus}`,
    message: `Votre paiement pour la réservation #${booking.bookingNumber} a été ${statusLabels[booking.paymentStatus] || booking.paymentStatus}.`,
    type: booking.paymentStatus === "SUCCEEDED" ? "SUCCESS" : booking.paymentStatus === "FAILED" ? "ERROR" : "INFO",
    link: `${APP_URL}/dashboard/bookings/${booking.id}`,
    prefKey: "payment",
    sendEmail: true,
    email: user.email,
    emailSubject: `DriveRent Maroc — Mise à jour du paiement pour #${booking.bookingNumber}`,
    emailHtml: paymentStatusUpdateEmail({
      customerName: user.firstName,
      bookingNumber: booking.bookingNumber,
      paymentStatus: booking.paymentStatus,
      amount: 0,
      dashboardUrl: `${APP_URL}/dashboard/bookings/${booking.id}`,
    }),
  });
}
