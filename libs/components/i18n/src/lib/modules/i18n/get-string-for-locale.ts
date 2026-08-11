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

  function getResourcesForLocale(locale: string): Record<string, string> {
    const parsedLocale = locale.toUpperCase().replace('_', '-');
    return resources[parsedLocale];
  }

  const localeFallback = [
    ...new Set([
      preferredLocale,
      preferredLocale.substring(0, 2),
      defaultLocale,
    ]),
  ];

  for (const locale of localeFallback) {
    const values = getResourcesForLocale(locale);
    if (values && values[name]) {
      return values[name];
    }
  }
  return undefined;
}
