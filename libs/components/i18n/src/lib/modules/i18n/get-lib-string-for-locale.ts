import { SkyLibResources } from './lib-resources';

const registry: Record<string, SkyLibResources> = {};

/**
 * @internal
 */
export function addLibResources(
  localeResources: Record<string, SkyLibResources>,
): void {
  for (const [locale, resources] of Object.entries(localeResources)) {
    registry[locale] = { ...registry[locale], ...resources };
  }
}

/**
 * @internal
 */
export function getLibResources(): Record<string, SkyLibResources> {
  return registry;
}

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
    locale.toUpperCase().replace(/_/g, '-');

  const normalizedPreferred = normalizeLocale(preferredLocale);
  const languageTag = normalizedPreferred.split('-')[0];

  const localeFallback = [
    ...new Set([
      normalizedPreferred,
      languageTag,
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
