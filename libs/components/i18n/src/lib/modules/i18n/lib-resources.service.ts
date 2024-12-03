// #region imports
import { Inject, Injectable, Optional } from '@angular/core';

import { Observable, forkJoin, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

import { Format } from '../../utils/format';

import { getLibStringForLocale } from './get-lib-string-for-locale';
import { SkyLibResources } from './lib-resources';
import { SkyLibResourcesProvider } from './lib-resources-provider';
import { SKY_LIB_RESOURCES_PROVIDERS } from './lib-resources-providers-token';
import { SkyAppLocaleInfo } from './locale-info';
import { SkyAppLocaleProvider } from './locale-provider';
import { SkyAppResourceNameProvider } from './resource-name-provider';

// #endregion

type ResourceKey = string;
type TemplatedResource = [ResourceKey, ...any[]];
type ResourceDictionary = Record<string, ResourceKey | TemplatedResource>;

@Injectable({
  providedIn: 'root',
})
export class SkyLibResourcesService {
  private static resources: Record<string, SkyLibResources> = {};

  #localeProvider: SkyAppLocaleProvider;
  #providers: SkyLibResourcesProvider[] | undefined;
  #resourceNameProvider: SkyAppResourceNameProvider | undefined;

  constructor(
    localeProvider: SkyAppLocaleProvider,
    @Optional()
    @Inject(SKY_LIB_RESOURCES_PROVIDERS)
    providers?: SkyLibResourcesProvider[],
    @Optional() resourceNameProvider?: SkyAppResourceNameProvider,
  ) {
    this.#localeProvider = localeProvider;
    this.#providers = providers;
    this.#resourceNameProvider = resourceNameProvider;
  }

  /**
   * Adds locale resources to be used by library components.
   */
  public static addResources(
    localeResources: Record<string, SkyLibResources>,
  ): void {
    for (const [locale, resources] of Object.entries(localeResources)) {
      SkyLibResourcesService.resources[locale] ||= {};
      SkyLibResourcesService.resources[locale] = {
        ...SkyLibResourcesService.resources[locale],
        ...resources,
      };
    }
  }

  /**
   * Gets a resource string based on its name.
   * @param name The name of the resource string.
   * @param args Any templated args.
   */
  public getString(name: string, ...args: any[]): Observable<string> {
    const mappedNameObs = this.#resourceNameProvider
      ? this.#resourceNameProvider.getResourceName(name)
      : observableOf(name);

    const localeInfoObs = this.#localeProvider.getLocaleInfo();

    return forkJoin([mappedNameObs, localeInfoObs]).pipe(
      map(([mappedName, localeInfo]) =>
        this.getStringForLocale(localeInfo, mappedName, ...args),
      ),
    );
  }

  /**
   * Gets a Resource String Dictionary.
   *
   * This is similar to forkJoin's dictionary syntax.
   *
   * @param dictionary a Record of **SomeObjectKey** to a Value that is either
   *   - (1) **ResourceKey**
   *   - (2) or an **Array** where the first item is the **ResourceKey** and the other items are template args.
   * @return an `Observable` of a resource string dictionary in the same shape as the passed dictionary.
   *
   * @example
   * ```typescript
   * service.getStrings({
   *    simpleKey: 'hello',
   *    arraySyntax: ['hi'],
   *    arraySyntaxWithTemplateArgs: ['template', 'a', 'b'],
   * }
   * ```
   */
  public getStrings<T extends ResourceDictionary>(
    dictionary: T,
  ): Observable<{ [K in keyof T]: string }> {
    const resources$: Record<string, Observable<string>> = {};

    for (const objKey of Object.keys(dictionary)) {
      const resource: string | [string, ...any[]] = dictionary[objKey];

      if (typeof resource === 'string') {
        resources$[objKey] = this.getString(resource);
      } else {
        const [key, ...templateItems] = resource;
        resources$[objKey] = this.getString(key, ...templateItems);
      }
    }

    return forkJoin(resources$) as Observable<{ [K in keyof T]: string }>;
  }

  public getStringForLocale(
    info: SkyAppLocaleInfo,
    name: string,
    ...args: any[]
  ): string {
    let value: string | undefined;

    // First, look in the static 'resources' property.
    value = getLibStringForLocale(
      SkyLibResourcesService.resources,
      info.locale,
      name,
    );

    // If it's not found there, look in the providers.
    if (value === undefined && this.#providers) {
      for (const provider of this.#providers) {
        const s = provider.getString(info, name);
        if (s !== undefined) {
          value = s;
          break;
        }
      }
    }

    if (value !== undefined) {
      return Format.formatText(value, ...args);
    }

    return name;
  }
}
