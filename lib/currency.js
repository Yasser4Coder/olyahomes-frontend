const aedFormatter = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Whole-dirham amounts for nightly rates and similar. */
export function formatAED(amount) {
  return aedFormatter.format(Number(amount));
}

const aedDetailed = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Booking totals and other exact amounts. */
export function formatAEDAmount(amount) {
  return aedDetailed.format(Number(amount));
}
