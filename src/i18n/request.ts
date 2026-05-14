import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

const messageModules = [
  'common',
  'navbar',
  'hero',
  'about',
  'packages',
  'gallery',
  'contact',
  'footer',
] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Load and merge all per-feature translation files
  const messageEntries = await Promise.all(
    messageModules.map(async (mod) => {
      const messages = (await import(`../../messages/${locale}/${mod}.json`))
        .default;
      return [mod, messages] as const;
    })
  );

  const messages = Object.fromEntries(messageEntries);

  return { locale, messages };
});
