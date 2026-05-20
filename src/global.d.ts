interface Messages {
  common: typeof import('../messages/en/common.json');
  navbar: typeof import('../messages/en/navbar.json');
  hero: typeof import('../messages/en/hero.json');
  about: typeof import('../messages/en/about.json');
  packages: typeof import('../messages/en/packages.json');
  gallery: typeof import('../messages/en/gallery.json');
  testimonials: typeof import('../messages/en/testimonials.json');
  faq: typeof import('../messages/en/faq.json');
  contact: typeof import('../messages/en/contact.json');
  footer: typeof import('../messages/en/footer.json');
  legal: typeof import('../messages/en/legal.json');
}

// Integrate type safe translations automatically across the project
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IntlMessages extends Messages {}
