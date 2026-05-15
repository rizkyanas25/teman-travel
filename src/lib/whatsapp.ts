const WA_NUMBER = "628886662507";

/**
 * Generate a WhatsApp deep link with an optional pre-filled message.
 */
export function getWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${WA_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
