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
      <div class="header"><h1>Booking Confirmed</h1></div>
      <div class="content">
        <p>Hi ${data.customerName},</p>
        <p>Your booking has been confirmed! Here are the details:</p>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
          <div class="detail-row"><span class="detail-label">Booking Number</span><span class="detail-value">#${data.bookingNumber}</span></div>
          <div class="detail-row"><span class="detail-label">Vehicle</span><span class="detail-value">${data.carName}</span></div>
          <div class="detail-row"><span class="detail-label">Pickup</span><span class="detail-value">${formatDate(data.pickupDate)}</span></div>
          <div class="detail-row"><span class="detail-label">Return</span><span class="detail-value">${formatDate(data.returnDate)}</span></div>
          <div class="detail-row"><span class="detail-label">Pickup Location</span><span class="detail-value">${data.pickupLocation}</span></div>
          <div class="detail-row" style="border-bottom:none;"><span class="detail-label">Total Amount</span><span class="detail-value" style="color:#7c3aed;font-size:18px;">${formatCurrency(data.totalAmount)}</span></div>
        </div>
        <p style="text-align:center;margin:24px 0;"><a href="${data.dashboardUrl}" class="btn">View Booking Details</a></p>
        <p style="color:#6b7280;font-size:14px;">Please bring a valid driver's license and the payment method used for booking when picking up your vehicle.</p>
      </div>
      <div class="footer"><p>DriveRent &copy; ${new Date().getFullYear()} &middot; Premium Car Rental</p></div>
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
      <div class="header" style="background:linear-gradient(135deg,#dc2626,#b91c1c);"><h1>Booking Cancelled</h1></div>
      <div class="content">
        <p>Hi ${data.customerName},</p>
        <p>Your booking <strong>#${data.bookingNumber}</strong> for the <strong>${data.carName}</strong> has been cancelled.</p>
        ${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ""}
        <p>If you believe this was a mistake, please contact our support team.</p>
      </div>
      <div class="footer"><p>DriveRent &copy; ${new Date().getFullYear()} &middot; Premium Car Rental</p></div>
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
      <div class="header" style="background:linear-gradient(135deg,#059669,#047857);"><h1>Payment Received</h1></div>
      <div class="content">
        <p>Hi ${data.customerName},</p>
        <p>We've received your payment. Here's your receipt:</p>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
          <div class="detail-row"><span class="detail-label">Invoice Number</span><span class="detail-value">${data.invoiceNumber}</span></div>
          <div class="detail-row"><span class="detail-label">Booking</span><span class="detail-value">#${data.bookingNumber}</span></div>
          <div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">${formatDate(data.paymentDate)}</span></div>
          <div class="detail-row" style="border-bottom:none;"><span class="detail-label">Amount Paid</span><span class="detail-value" style="color:#059669;font-size:18px;">${formatCurrency(data.amount)}</span></div>
        </div>
        <p style="text-align:center;margin:24px 0;"><a href="${data.dashboardUrl}" class="btn" style="background:#059669;">View Invoice</a></p>
      </div>
      <div class="footer"><p>DriveRent &copy; ${new Date().getFullYear()} &middot; Premium Car Rental</p></div>
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
      <div class="header"><h1>Welcome to DriveRent</h1></div>
      <div class="content">
        <p>Hi ${data.customerName},</p>
        <p>Welcome to <strong>DriveRent</strong> — your premium car rental experience!</p>
        <p>You can now browse our luxury fleet, make bookings, and manage everything from your personal dashboard.</p>
        <p style="text-align:center;margin:24px 0;"><a href="${data.dashboardUrl}" class="btn">Go to Dashboard</a></p>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="margin:0;font-weight:600;">What you can do:</p>
          <ul style="color:#6b7280;margin:8px 0;padding-left:20px;">
            <li>Browse our premium fleet of vehicles</li>
            <li>Book cars with flexible pickup/dropoff</li>
            <li>Manage your bookings from your dashboard</li>
            <li>Save your favorite cars for quick access</li>
          </ul>
        </div>
      </div>
      <div class="footer"><p>DriveRent &copy; ${new Date().getFullYear()} &middot; Premium Car Rental</p></div>
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
      <div class="header" style="background:linear-gradient(135deg,#d97706,#b45309);"><h1>Upcoming Pickup Reminder</h1></div>
      <div class="content">
        <p>Hi ${data.customerName},</p>
        <p>This is a friendly reminder that your vehicle pickup is coming up soon!</p>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
          <div class="detail-row"><span class="detail-label">Booking</span><span class="detail-value">#${data.bookingNumber}</span></div>
          <div class="detail-row"><span class="detail-label">Vehicle</span><span class="detail-value">${data.carName}</span></div>
          <div class="detail-row"><span class="detail-label">Pickup Date</span><span class="detail-value">${formatDate(data.pickupDate)}</span></div>
          <div class="detail-row" style="border-bottom:none;"><span class="detail-label">Location</span><span class="detail-value">${data.pickupLocation}</span></div>
        </div>
        <p>Please remember to bring your valid driver's license and payment method.</p>
      </div>
      <div class="footer"><p>DriveRent &copy; ${new Date().getFullYear()} &middot; Premium Car Rental</p></div>
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
      <div class="header" style="background:linear-gradient(135deg,#2563eb,#1d4ed8);"><h1>How Was Your Ride?</h1></div>
      <div class="content">
        <p>Hi ${data.customerName},</p>
        <p>We hope you enjoyed driving the <strong>${data.carName}</strong>!</p>
        <p>Your feedback helps us improve and helps other customers make informed decisions.</p>
        <p style="text-align:center;margin:24px 0;"><a href="${data.carUrl}" class="btn" style="background:#2563eb;">Leave a Review</a></p>
      </div>
      <div class="footer"><p>DriveRent &copy; ${new Date().getFullYear()} &middot; Premium Car Rental</p></div>
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
      <div class="header"><h1>New Booking Received</h1></div>
      <div class="content">
        <p>A new booking has been made:</p>
        <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;">
          <div class="detail-row"><span class="detail-label">Booking</span><span class="detail-value">#${data.bookingNumber}</span></div>
          <div class="detail-row"><span class="detail-label">Customer</span><span class="detail-value">${data.customerName}</span></div>
          <div class="detail-row"><span class="detail-label">Vehicle</span><span class="detail-value">${data.carName}</span></div>
          <div class="detail-row" style="border-bottom:none;"><span class="detail-label">Total</span><span class="detail-value" style="color:#7c3aed;">${formatCurrency(data.totalAmount)}</span></div>
        </div>
        <p style="text-align:center;margin:24px 0;"><a href="${data.adminUrl}" class="btn">Manage Booking</a></p>
      </div>
      <div class="footer"><p>DriveRent Admin &copy; ${new Date().getFullYear()}</p></div>
    </div></body></html>
  `;
}
