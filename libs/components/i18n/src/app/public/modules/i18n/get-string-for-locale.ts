import {
  SkyAppResources
} from '@skyux/i18n';

export function getStringForLocale(
  resources: {
    [locale: string]: SkyAppResources
  },
  preferredLocale: string,
  name: string
): string {
  const defaultLocale = 'en-US';

  function getResourcesForLocale(locale: string): SkyAppResources {
    const parsedLocale = locale.toUpperCase().replace('_', '-');
    return resources[parsedLocale];
  }

  let values: any = getResourcesForLocale(preferredLocale);

  if (values && values[name]) {
    return values[name];
  }

  // Attempt to locate default resources.
  values = getResourcesForLocale(defaultLocale);

  if (values && values[name]) {
    return values[name];
  }

  return '';
}
