/**
 * Single source of truth for contact details used across every CTA, the
 * contact form, and the footer.
 */
export const WHATSAPP_NUMBER = "919446081269";
export const CONTACT_EMAIL = "hello@ajoabraham.com"; // TODO: replace with Ajo Abraham's real business email
export const INSTAGRAM_HANDLE = "ajo__abraham";
export const INSTAGRAM_URL = "https://www.instagram.com/ajo__abraham/";
export const PHOTOGRAPHER_NAME = "Ajo Abraham";
export const BUSINESS_LOCATION = "Kerala, India";
export const SITE_TAGLINE = "Stories in Light. Memories for Life.";

export function whatsappLink(message = "Hi Ajo, I'd like to enquire about a photography session."): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
