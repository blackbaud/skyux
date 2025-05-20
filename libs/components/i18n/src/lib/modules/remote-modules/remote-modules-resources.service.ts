import { Injectable, inject } from '@angular/core';

import { Observable, forkJoin, map, of } from 'rxjs';

import { Format } from '../../utils/format';
import { SkyAppLocaleInfo } from '../i18n/locale-info';
import { SkyAppLocaleProvider } from '../i18n/locale-provider';
import { SkyAppResourceNameProvider } from '../i18n/resource-name-provider';

import { SkyRemoteModulesResources } from './remote-modules-resources';

function getResourceValue(
  resourceName: string,
  resources: Record<string, SkyRemoteModulesResources>,
  preferredLocale: string,
): string | undefined {
  const defaultLocale = 'en-US';

  const getResources = (locale: string): SkyRemoteModulesResources => {
    const normalizedLocale = locale.toUpperCase().replace('_', '-');
    return resources[normalizedLocale];
  };

  const value =
    getResources(preferredLocale)?.[resourceName]?.message ??
    getResources(defaultLocale)?.[resourceName]?.message;

  return value;
}

/**
 * Handles retrieval of string resources for remote modules.
 */
@Injectable()
export class SkyRemoteModulesResourcesService {
  private static resources: Record<string, SkyRemoteModulesResources> = {};

  readonly #localeProvider = inject(SkyAppLocaleProvider);
  readonly #resourceNameProvider = inject(SkyAppResourceNameProvider, {
    optional: true,
  });

  public static addResources(
    localeResources: Record<string, SkyRemoteModulesResources>,
  ): void {
    for (const [locale, resources] of Object.entries(localeResources)) {
      SkyRemoteModulesResourcesService.resources[locale] = {
        ...(SkyRemoteModulesResourcesService.resources[locale] ?? {}),
        ...resources,
      };
    }
  }

  public getString(
    resourceName: string,
    ...args: unknown[]
  ): Observable<string> {
    const localeInfoObs = this.#localeProvider.getLocaleInfo();

    const mappedNameObs =
      this.#resourceNameProvider?.getResourceName(resourceName) ??
      of(resourceName);

    return forkJoin([localeInfoObs, mappedNameObs]).pipe(
      map(([localeInfo, mappedName]) =>
        this.#getStringForLocale(localeInfo, mappedName, ...args),
      ),
    );
  }

  #getStringForLocale(
    localeInfo: SkyAppLocaleInfo,
    resourceName: string,
    ...args: unknown[]
  ): string {
    const value = getResourceValue(
      resourceName,
      SkyRemoteModulesResourcesService.resources,
      localeInfo.locale,
    );

    return value !== undefined
      ? Format.formatText(value, ...args)
      : resourceName;
  }
}
