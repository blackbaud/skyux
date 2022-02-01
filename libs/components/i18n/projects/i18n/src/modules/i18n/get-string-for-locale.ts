import { SkyAppResources } from './resources';

/**
 * @internal
 * @deprecated Use `getLibStringForLocale` instead.
 */
export function getStringForLocale(
  resources: {
    [locale: string]: {
      [name: string]: string;
    };
  },
  preferredLocale: string,
  name: string
): string | undefined {
  const defaultLocale = 'en-US';

  function getResourcesForLocale(locale: string): { [name: string]: string } {
    const parsedLocale = locale.toUpperCase().replace('_', '-');
    return resources[parsedLocale];
  }

  let values: { [name: string]: string } =
    getResourcesForLocale(preferredLocale);

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
