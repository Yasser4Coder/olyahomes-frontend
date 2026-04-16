/**
 * Public product name — must match **exactly** the “App name” on the Google OAuth
 * consent screen (same spelling and capitalization), or Google verification will fail.
 *
 * If you change the name in Google Cloud Console, update this string to match.
 */
export const APP_DISPLAY_NAME = "Olya holiday homes";

/** Default `<title>` / Open Graph site line */
export const APP_DEFAULT_TITLE = `${APP_DISPLAY_NAME} — Holiday home rentals`;

/**
 * Site-wide meta: what the app does + why we request personal data (for stores,
 * OAuth verification, and search snippets).
 */
export const APP_META_DESCRIPTION =
  `${APP_DISPLAY_NAME} is a web application for discovering and booking short-term holiday home rentals in the UAE: browse listings with clear pricing in AED, choose check-in and check-out dates and guest count, and pay securely at checkout. Hosts can list and manage properties; administrators oversee listings and bookings. We collect your name, email address, and phone number—and, if you use Google sign-in, basic profile details Google shares with your consent—to create and secure your account, complete bookings and payments, communicate about your stay, and improve the service. See our Privacy Policy for full details.`;
