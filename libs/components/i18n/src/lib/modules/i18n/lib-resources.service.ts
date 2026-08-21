// #region imports
import { Inject, Injectable, Optional } from '@angular/core';

import { EMPTY, Observable, combineLatest, of as observableOf } from 'rxjs';
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
type TemplatedResource = [ResourceKey, ...unknown[]];
type ResourceDictionary = Record<string, ResourceKey | TemplatedResource>;

@Injectable({
  providedIn: 'root',
})
export class SkyLibResourcesService {
  #localeProvider: SkyAppLocaleProvider;
  #providers: SkyLibResourcesProvider[] | undefined;
  #resourceNameProvider: SkyAppResourceNameProvider | undefined;

  /* eslint-disable @angular-eslint/prefer-inject -- constructor injection is required to maintain the public API for consumers who may instantiate this service directly (e.g. `new SkyLibResourcesService(...)`) */
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
   */
  public static addResources(
    localeResources: Record<string, SkyLibResources>,
  ): void {
    addLibResources(localeResources);
  }

  /**
   * Gets a resource string based on its name.
   * Emits whenever the locale changes.
   * @param name The name of the resource string.
   * @param args Any templated args.
   */
  public getString(name: string, ...args: unknown[]): Observable<string> {
    const mappedNameObs = this.#getMappedNameObs(name);
    const localeInfoObs = this.#localeProvider.getLocaleInfo();
    return combineLatest([mappedNameObs, localeInfoObs]).pipe(
      map(([mappedName, localeInfo]) =>
        this.getStringForLocale(localeInfo, mappedName, ...args),
      ),
    );
  }

  /**
   * Gets a Resource String Dictionary.
   * Emits whenever the locale changes.
   *
   * This is similar to forkJoin's dictionary syntax, but re-emits on locale changes.
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
    const entries = Object.entries(dictionary).map(([objKey, resource]) => {
      const [name, ...args] = Array.isArray(resource) ? resource : [resource];
      return { objKey, name, args };
    });

    if (entries.length === 0) {
      return EMPTY;
    }

    const mappedNames$ = combineLatest(
      entries.map(({ name }) => this.#getMappedNameObs(name)),
    );

    return combineLatest([
      mappedNames$,
      this.#localeProvider.getLocaleInfo(),
    ]).pipe(
      map(([mappedNames, localeInfo]) => {
        const strings = {} as { [K in keyof T]: string };
        entries.forEach(({ objKey, args }, i) => {
          strings[objKey as keyof T] = this.getStringForLocale(
            localeInfo,
            mappedNames[i],
            ...args,
          );
        });
        return strings;
      }),
    );
  }

  public getStringForLocale(
    info: SkyAppLocaleInfo,
    name: string,
    ...args: unknown[]
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

  #getMappedNameObs(name: string): Observable<string> {
    return this.#resourceNameProvider
      ? this.#resourceNameProvider.getResourceName(name)
      : observableOf(name);
  }
}
