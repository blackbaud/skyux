// #region imports
import { Inject, Injectable, Optional } from '@angular/core';

import { Observable, forkJoin, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

import { Format } from '../../utils/format';

import {
  addLibResources,
  getLibResources,
  getLibStringForLocale,
} from './get-lib-string-for-locale';
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

/**
 * An Angular service for interacting with library resource strings.
 *
 * @deprecated This service preserves the behavior `SkyLibResourcesService` had before
 * SKY UX 15, when its observables emitted a single value and completed. It exists only
 * as a temporary landing spot for code that relied on that completion, and the SKY UX 15
 * `ng update` migration pointed existing code here automatically. Because it resolves
 * the locale only once, the strings it returns go stale when the user's locale changes.
 * Move back to `SkyLibResourcesService` — removing any dependency on the observables
 * completing, such as `forkJoin`, `lastValueFrom`, or `toPromise` — so displayed strings
 * stay in sync with the active locale. This service will be removed in a future major
 * version.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyLibResourcesLegacyService {
  #localeProvider: SkyAppLocaleProvider;
  #providers: SkyLibResourcesProvider[] | undefined;
  #resourceNameProvider: SkyAppResourceNameProvider | undefined;

  /* eslint-disable @angular-eslint/prefer-inject -- constructor injection is required to maintain the public API for consumers who may instantiate this service directly (e.g. `new SkyLibResourcesLegacyService(...)`) */
  constructor(
    localeProvider: SkyAppLocaleProvider,
    @Optional()
    @Inject(SKY_LIB_RESOURCES_PROVIDERS)
    providers?: SkyLibResourcesProvider[],
    @Optional() resourceNameProvider?: SkyAppResourceNameProvider,
  ) {
    /* eslint-enable @angular-eslint/prefer-inject */
    this.#localeProvider = localeProvider;
    this.#providers = providers;
    this.#resourceNameProvider = resourceNameProvider;
  }

  /**
   * Adds locale resources to be used by library components.
   *
   * @deprecated Use `SkyLibResourcesService.addResources()` instead. It behaves identically
   * and shares the same underlying resource registry, so migrating requires no other changes
   * and lets you drop this service entirely.
   */
  public static addResources(
    localeResources: Record<string, SkyLibResources>,
  ): void {
    addLibResources(localeResources);
  }

  /**
   * Gets a resource string based on its name. Emits once and completes.
   * @param name The name of the resource string.
   * @param args Any templated args.
   * @deprecated This method reads the locale once and completes, so the string it emits
   * is not updated when the user's locale changes. Use `SkyLibResourcesService.getString()`
   * instead, which re-emits the translated string on every locale change. Subscribers must
   * no longer rely on the observable completing.
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
   * Gets a Resource String Dictionary. Emits once and completes.
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
   *
   * @deprecated This method reads the locale once and completes, so the dictionary it emits
   * is not updated when the user's locale changes. Use `SkyLibResourcesService.getStrings()`
   * instead, which re-emits the translated dictionary on every locale change. Subscribers
   * must no longer rely on the observable completing.
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

  /**
   * Gets a resource string for a specific locale based on its name.
   * @param info The locale to use.
   * @param name The name of the resource string.
   * @param args Any templated args.
   * @deprecated Use `SkyLibResourcesService.getStringForLocale()` instead. Because the locale
   * is passed in explicitly, that method behaves the same as this one, so migrating requires
   * no other changes and lets you drop this service entirely.
   */
  public getStringForLocale(
    info: SkyAppLocaleInfo,
    name: string,
    ...args: any[]
  ): string {
    let value: string | undefined;

    // First, look in the static 'resources' property.
    value = getLibStringForLocale(getLibResources(), info.locale, name);

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
