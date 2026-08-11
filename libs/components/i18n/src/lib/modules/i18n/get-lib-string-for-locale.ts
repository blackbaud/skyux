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

  function getResourcesForLocale(locale: string): SkyLibResources {
    const parsedLocale = locale.toLocaleUpperCase().replace('_', '-');
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
      return values[name].message;
    }
  }
  return undefined;
}
