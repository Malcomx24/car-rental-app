import { formatCurrency, formatDate } from "./utils";

const BASE_STYLE = `
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #7c3aed, #6d28d9); padding: 32px 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
    .content { padding: 32px 24px; }
    .footer { padding: 24px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; }
    .btn { display: inline-block; background: #7c3aed; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
    .detail-label { color: #6b7280; }
    .detail-value { font-weight: 600; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .badge-success { background: #d1fae5; color: #065f46; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-danger { background: #fee2e2; color: #991b1b; }
  </style>
`;

export function bookingConfirmationEmail(data: {
  customerName: string;
  bookingNumber: string;
  carName: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  totalAmount: number;
  dashboardUrl: string;
}) {
  return `
    <!DOCTYPE html><html><head>${BASE_STYLE}</head><body>
    <div class="container">
      <div class="header"><h1>Réservation confirmée</h1></div>
      <div class="content">
        <p>Bonjour ${data.customerName},</p>
        <p>Votre réservation a été confirmée ! Voici les détails :</p>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
          <div class="detail-row"><span class="detail-label">Numéro de réservation</span><span class="detail-value">#${data.bookingNumber}</span></div>
          <div class="detail-row"><span class="detail-label">Véhicule</span><span class="detail-value">${data.carName}</span></div>
          <div class="detail-row"><span class="detail-label">Date de départ</span><span class="detail-value">${formatDate(data.pickupDate)}</span></div>
          <div class="detail-row"><span class="detail-label">Date de retour</span><span class="detail-value">${formatDate(data.returnDate)}</span></div>
          <div class="detail-row"><span class="detail-label">Lieu de départ</span><span class="detail-value">${data.pickupLocation}</span></div>
          <div class="detail-row" style="border-bottom:none;"><span class="detail-label">Montant total</span><span class="detail-value" style="color:#7c3aed;font-size:18px;">${formatCurrency(data.totalAmount)}</span></div>
        </div>
        <p style="text-align:center;margin:24px 0;"><a href="${data.dashboardUrl}" class="btn">Voir les détails</a></p>
        <p style="color:#6b7280;font-size:14px;">Veuillez apporter un permis de conduire valide et le mode de paiement utilisé lors de la récupération du véhicule.</p>
      </div>
      <div class="footer"><p>DriveRent Maroc &copy; ${new Date().getFullYear()} &middot; Location de véhicules premium</p></div>
    </div></body></html>
  `;
}

export function bookingCancelledEmail(data: {
  customerName: string;
  bookingNumber: string;
  carName: string;
  reason: string;
}) {
  return `
    <!DOCTYPE html><html><head>${BASE_STYLE}</head><body>
    <div class="container">
      <div class="header" style="background:linear-gradient(135deg,#dc2626,#b91c1c);"><h1>Réservation annulée</h1></div>
      <div class="content">
        <p>Bonjour ${data.customerName},</p>
        <p>Votre réservation <strong>#${data.bookingNumber}</strong> pour le <strong>${data.carName}</strong> a été annulée.</p>
        ${data.reason ? `<p><strong>Motif :</strong> ${data.reason}</p>` : ""}
        <p>Si vous pensez qu'il s'agit d'une erreur, veuillez contacter notre équipe de support.</p>
      </div>
      <div class="footer"><p>DriveRent Maroc &copy; ${new Date().getFullYear()} &middot; Location de véhicules premium</p></div>
    </div></body></html>
  `;
}

export function paymentReceiptEmail(data: {
  customerName: string;
  bookingNumber: string;
  amount: number;
  paymentDate: string;
  invoiceNumber: string;
  dashboardUrl: string;
}) {
  return `
    <!DOCTYPE html><html><head>${BASE_STYLE}</head><body>
    <div class="container">
      <div class="header" style="background:linear-gradient(135deg,#059669,#047857);"><h1>Paiement reçu</h1></div>
      <div class="content">
        <p>Bonjour ${data.customerName},</p>
        <p>Nous avons bien reçu votre paiement. Voici votre reçu :</p>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
          <div class="detail-row"><span class="detail-label">Numéro de facture</span><span class="detail-value">${data.invoiceNumber}</span></div>
          <div class="detail-row"><span class="detail-label">Réservation</span><span class="detail-value">#${data.bookingNumber}</span></div>
          <div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">${formatDate(data.paymentDate)}</span></div>
          <div class="detail-row" style="border-bottom:none;"><span class="detail-label">Montant payé</span><span class="detail-value" style="color:#059669;font-size:18px;">${formatCurrency(data.amount)}</span></div>
        </div>
        <p style="text-align:center;margin:24px 0;"><a href="${data.dashboardUrl}" class="btn" style="background:#059669;">Voir la facture</a></p>
      </div>
      <div class="footer"><p>DriveRent Maroc &copy; ${new Date().getFullYear()} &middot; Location de véhicules premium</p></div>
    </div></body></html>
  `;
}

export function welcomeEmail(data: {
  customerName: string;
  dashboardUrl: string;
}) {
  return `
    <!DOCTYPE html><html><head>${BASE_STYLE}</head><body>
    <div class="container">
      <div class="header"><h1>Bienvenue chez DriveRent Maroc</h1></div>
      <div class="content">
        <p>Bonjour ${data.customerName},</p>
        <p>Bienvenue chez <strong>DriveRent Maroc</strong> — votre expérience de location de véhicules premium !</p>
        <p>Vous pouvez désormais parcourir notre flotte, effectuer des réservations et gérer tout depuis votre tableau de bord personnel.</p>
        <p style="text-align:center;margin:24px 0;"><a href="${data.dashboardUrl}" class="btn">Accéder au tableau de bord</a></p>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="margin:0;font-weight:600;">Ce que vous pouvez faire :</p>
          <ul style="color:#6b7280;margin:8px 0;padding-left:20px;">
            <li>Parcourir notre flotte de véhicules premium</li>
            <li>Réserver des voitures avec récupération et retour flexibles</li>
            <li>Gérer vos réservations depuis votre tableau de bord</li>
            <li>Enregistrer vos véhicules favoris pour un accès rapide</li>
          </ul>
        </div>
      </div>
      <div class="footer"><p>DriveRent Maroc &copy; ${new Date().getFullYear()} &middot; Location de véhicules premium</p></div>
    </div></body></html>
  `;
}

export function bookingReminderEmail(data: {
  customerName: string;
  bookingNumber: string;
  carName: string;
  pickupDate: string;
  pickupLocation: string;
}) {
  return `
    <!DOCTYPE html><html><head>${BASE_STYLE}</head><body>
    <div class="container">
      <div class="header" style="background:linear-gradient(135deg,#d97706,#b45309);"><h1>Rappel de récupération</h1></div>
      <div class="content">
        <p>Bonjour ${data.customerName},</p>
        <p>Ceci est un rappel amical : la récupération de votre véhicule approche !</p>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
          <div class="detail-row"><span class="detail-label">Réservation</span><span class="detail-value">#${data.bookingNumber}</span></div>
          <div class="detail-row"><span class="detail-label">Véhicule</span><span class="detail-value">${data.carName}</span></div>
          <div class="detail-row"><span class="detail-label">Date de récupération</span><span class="detail-value">${formatDate(data.pickupDate)}</span></div>
          <div class="detail-row" style="border-bottom:none;"><span class="detail-label">Lieu</span><span class="detail-value">${data.pickupLocation}</span></div>
        </div>
        <p>N'oubliez pas d'apporter votre permis de conduire valide et votre moyen de paiement.</p>
      </div>
      <div class="footer"><p>DriveRent Maroc &copy; ${new Date().getFullYear()} &middot; Location de véhicules premium</p></div>
    </div></body></html>
  `;
}

export function reviewRequestEmail(data: {
  customerName: string;
  carName: string;
  carUrl: string;
}) {
  return `
    <!DOCTYPE html><html><head>${BASE_STYLE}</head><body>
    <div class="container">
      <div class="header" style="background:linear-gradient(135deg,#2563eb,#1d4ed8);"><h1>Comment s'est passée votre location ?</h1></div>
      <div class="content">
        <p>Bonjour ${data.customerName},</p>
        <p>Nous espérons que vous avez apprécié votre trajet avec le <strong>${data.carName}</strong> !</p>
        <p>Vos retours nous aident à nous améliorer et aident d'autres clients à faire des choix éclairés.</p>
        <p style="text-align:center;margin:24px 0;"><a href="${data.carUrl}" class="btn" style="background:#2563eb;">Laisser un avis</a></p>
      </div>
      <div class="footer"><p>DriveRent Maroc &copy; ${new Date().getFullYear()} &middot; Location de véhicules premium</p></div>
    </div></body></html>
  `;
}

export function adminNewBookingEmail(data: {
  bookingNumber: string;
  customerName: string;
  carName: string;
  totalAmount: number;
  adminUrl: string;
}) {
  return `
    <!DOCTYPE html><html><head>${BASE_STYLE}</head><body>
    <div class="container">
      <div class="header"><h1>Nouvelle réservation reçue</h1></div>
      <div class="content">
        <p>Une nouvelle réservation a été effectuée :</p>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
          <div class="detail-row"><span class="detail-label">Réservation</span><span class="detail-value">#${data.bookingNumber}</span></div>
          <div class="detail-row"><span class="detail-label">Client</span><span class="detail-value">${data.customerName}</span></div>
          <div class="detail-row"><span class="detail-label">Véhicule</span><span class="detail-value">${data.carName}</span></div>
          <div class="detail-row" style="border-bottom:none;"><span class="detail-label">Total</span><span class="detail-value" style="color:#7c3aed;">${formatCurrency(data.totalAmount)}</span></div>
        </div>
        <p style="text-align:center;margin:24px 0;"><a href="${data.adminUrl}" class="btn">Gérer la réservation</a></p>
      </div>
      <div class="footer"><p>DriveRent Maroc Admin &copy; ${new Date().getFullYear()}</p></div>
    </div></body></html>
  `;
}

export function bankTransferConfirmationEmail(data: {
  customerName: string;
  bookingNumber: string;
  carName: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  totalAmount: number;
  bankName: string;
  accountHolder: string;
  iban: string;
  swiftCode?: string;
  instructions?: string;
  dashboardUrl: string;
}) {
  return `
    <!DOCTYPE html><html><head>${BASE_STYLE}</head><body>
    <div class="container">
      <div class="header" style="background:linear-gradient(135deg,#2563eb,#1d4ed8);"><h1>Instructions de virement bancaire</h1></div>
      <div class="content">
        <p>Bonjour ${data.customerName},</p>
        <p>Votre réservation <strong>#${data.bookingNumber}</strong> a été reçue. Veuillez effectuer le paiement par virement bancaire.</p>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
          <div class="detail-row"><span class="detail-label">Numéro de réservation</span><span class="detail-value">#${data.bookingNumber}</span></div>
          <div class="detail-row"><span class="detail-label">Véhicule</span><span class="detail-value">${data.carName}</span></div>
          <div class="detail-row"><span class="detail-label">Date de départ</span><span class="detail-value">${formatDate(data.pickupDate)}</span></div>
          <div class="detail-row"><span class="detail-label">Date de retour</span><span class="detail-value">${formatDate(data.returnDate)}</span></div>
          <div class="detail-row"><span class="detail-label">Lieu de départ</span><span class="detail-value">${data.pickupLocation}</span></div>
          <div class="detail-row" style="border-bottom:none;"><span class="detail-label">Montant à virer</span><span class="detail-value" style="color:#2563eb;font-size:18px;">${formatCurrency(data.totalAmount)}</span></div>
        </div>
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="margin:0 0 8px 0;font-weight:600;color:#1e40af;">Coordonnées bancaires</p>
          <div class="detail-row"><span class="detail-label">Banque</span><span class="detail-value">${data.bankName}</span></div>
          <div class="detail-row"><span class="detail-label">Titulaire du compte</span><span class="detail-value">${data.accountHolder}</span></div>
          <div class="detail-row"><span class="detail-label">IBAN / RIB</span><span class="detail-value">${data.iban}</span></div>
          ${data.swiftCode ? `<div class="detail-row"><span class="detail-label">Code Swift</span><span class="detail-value">${data.swiftCode}</span></div>` : ""}
          <div class="detail-row" style="border-bottom:none;"><span class="detail-label">Référence</span><span class="detail-value">${data.bookingNumber}</span></div>
        </div>
        ${data.instructions ? `<div style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:16px;margin:16px 0;"><p style="margin:0 0 8px 0;font-weight:600;color:#92400e;">Instructions</p><p style="margin:0;color:#92400e;font-size:14px;">${data.instructions}</p></div>` : ""}
        <p style="text-align:center;margin:24px 0;"><a href="${data.dashboardUrl}" class="btn" style="background:#2563eb;">Voir les détails</a></p>
        <p style="color:#6b7280;font-size:14px;">Veuillez indiquer votre numéro de réservation <strong>#${data.bookingNumber}</strong> dans le motif du virement. Votre réservation sera confirmée après vérification du paiement.</p>
      </div>
      <div class="footer"><p>DriveRent Maroc &copy; ${new Date().getFullYear()} &middot; Location de véhicules premium</p></div>
    </div></body></html>
  `;
}

export function payAtPickupConfirmationEmail(data: {
  customerName: string;
  bookingNumber: string;
  carName: string;
  pickupDate: string;
  pickupLocation: string;
  totalAmount: number;
  dashboardUrl: string;
}) {
  return `
    <!DOCTYPE html><html><head>${BASE_STYLE}</head><body>
    <div class="container">
      <div class="header"><h1>Réservation confirmée — Paiement à la récupération</h1></div>
      <div class="content">
        <p>Bonjour ${data.customerName},</p>
        <p>Votre réservation <strong>#${data.bookingNumber}</strong> a été confirmée ! Vous paierez lors de la récupération du véhicule.</p>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
          <div class="detail-row"><span class="detail-label">Numéro de réservation</span><span class="detail-value">#${data.bookingNumber}</span></div>
          <div class="detail-row"><span class="detail-label">Véhicule</span><span class="detail-value">${data.carName}</span></div>
          <div class="detail-row"><span class="detail-label">Date de récupération</span><span class="detail-value">${formatDate(data.pickupDate)}</span></div>
          <div class="detail-row"><span class="detail-label">Lieu de récupération</span><span class="detail-value">${data.pickupLocation}</span></div>
          <div class="detail-row" style="border-bottom:none;"><span class="detail-label">Montant dû à la récupération</span><span class="detail-value" style="color:#7c3aed;font-size:18px;">${formatCurrency(data.totalAmount)}</span></div>
        </div>
        <p style="text-align:center;margin:24px 0;"><a href="${data.dashboardUrl}" class="btn">Voir les détails</a></p>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="margin:0;color:#166534;font-size:14px;"><strong>Documents à apporter :</strong> Permis de conduire valide, pièce d'identité et moyen de paiement (carte bancaire ou espèces).</p>
        </div>
      </div>
      <div class="footer"><p>DriveRent Maroc &copy; ${new Date().getFullYear()} &middot; Location de véhicules premium</p></div>
    </div></body></html>
  `;
}

export function paymentStatusUpdateEmail(data: {
  customerName: string;
  bookingNumber: string;
  paymentStatus: string;
  amount: number;
  dashboardUrl: string;
}) {
  const statusMessages: Record<string, { title: string; color: string; bg: string; message: string }> = {
    SUCCEEDED: { title: "Paiement confirmé", color: "#059669", bg: "#d1fae5", message: "Votre paiement a été reçu et confirmé. Merci !" },
    FAILED: { title: "Paiement échoué", color: "#dc2626", bg: "#fee2e2", message: "Malheureusement, votre paiement n'a pas pu être traité. Veuillez réessayer ou contacter le support." },
    AWAITING_TRANSFER: { title: "Virement en attente", color: "#2563eb", bg: "#eff6ff", message: "Votre virement bancaire est en cours de traitement. Nous confirmerons la réception du paiement." },
    REFUNDED: { title: "Paiement remboursé", color: "#7c3aed", bg: "#ede9fe", message: "Votre paiement a été remboursé. Cela peut prendre 3 à 5 jours ouvrés avant d'apparaître sur votre compte." },
  };
  const s = statusMessages[data.paymentStatus] || statusMessages.SUCCEEDED;
  return `
    <!DOCTYPE html><html><head>${BASE_STYLE}</head><body>
    <div class="container">
      <div class="header" style="background:linear-gradient(135deg,${s.color},${s.color});"><h1>${s.title}</h1></div>
      <div class="content">
        <p>Bonjour ${data.customerName},</p>
        <p>${s.message}</p>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
          <div class="detail-row"><span class="detail-label">Réservation</span><span class="detail-value">#${data.bookingNumber}</span></div>
          <div class="detail-row"><span class="detail-label">Montant</span><span class="detail-value">${formatCurrency(data.amount)}</span></div>
          <div class="detail-row" style="border-bottom:none;"><span class="detail-label">Statut</span><span class="detail-value">${data.paymentStatus.replace("_", " ")}</span></div>
        </div>
        <p style="text-align:center;margin:24px 0;"><a href="${data.dashboardUrl}" class="btn" style="background:${s.color};">Voir les détails</a></p>
      </div>
      <div class="footer"><p>DriveRent Maroc &copy; ${new Date().getFullYear()} &middot; Location de véhicules premium</p></div>
    </div></body></html>
  `;
}
