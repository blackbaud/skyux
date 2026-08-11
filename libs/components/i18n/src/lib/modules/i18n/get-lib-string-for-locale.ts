import { SkyLibResources } from './lib-resources';

/**
 * @internal
 */
export function getLibStringForLocale(
  resources: Record<string, SkyLibResources>,
  preferredLocale: string,
  name: string,
): string | undefined {
  const defaultLocale = 'en-US';

  const normalizeLocale = (locale: string): string =>
    locale.toLocaleUpperCase().replace('_', '-');

  const localeFallback = [
    ...new Set([
      normalizeLocale(preferredLocale),
      normalizeLocale(preferredLocale.substring(0, 2)),
      normalizeLocale(defaultLocale),
    ]),
  ];

  for (const locale of localeFallback) {
    const values = resources[locale];
    if (values && values[name]) {
      return values[name].message;
    }
  }
  return undefined;
}
