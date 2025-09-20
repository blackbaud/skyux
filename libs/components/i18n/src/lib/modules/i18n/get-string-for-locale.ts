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

  let values: Record<string, string> = getResourcesForLocale(preferredLocale);

  if (values && values[name]) {
    return values[name];
  }

  // Attempt to locate default resources.
  values = getResourcesForLocale(defaultLocale);

  if (values && values[name]) {
    return values[name];
  }
  return undefined;
}
