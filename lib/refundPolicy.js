/**
 * Guest cancellation & refund rules — keep aligned with
 * `backend/src/services/bookingRefundPolicy.service.js` and
 * `backend/src/services/bookingGuestCancel.service.js`.
 */

/** Short bullets for listing sidebar “Good to know”. */
export const refundPolicyListingBullets = [
  "Within 1 hour of making a paid booking: full refund of what you paid for the stay.",
  "More than 48 hours before check-in: full refund.",
  "Between 24 and 48 hours before check-in: 50% refund of the stay total.",
  "Within 24 hours of check-in: no refund — you can still cancel to release the dates, but the stay is non-refundable.",
  "Approved refunds return to your original payment method and usually take 5–10 business days.",
];
