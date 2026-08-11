/**
 * @internal
 * @deprecated Use `getLibStringForLocale` instead.
 */
export function getStringForLocale(
  resources: Record<string, Record<string, string>>,
  preferredLocale: string,
  name: string,
): string | undefined {
  const defaultLocale = 'en-US';

  const normalizeLocale = (locale: string): string =>
    locale.toUpperCase().replace('_', '-');

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
      return values[name];
    }
  }
  return undefined;
}
