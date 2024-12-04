import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional, forwardRef } from '@angular/core';
import { SkyAppAssetsService } from '@skyux/assets';

import {
  Observable,
  ReplaySubject,
  forkJoin,
  of as observableOf,
  share,
} from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Format } from '../../utils/format';

import { SkyAppLocaleInfo } from './locale-info';
import { SkyAppLocaleProvider } from './locale-provider';
import { SkyAppResourceNameProvider } from './resource-name-provider';

type SkyResourceType = Record<string, { message: string }>;
type ResourceKey = string;
type TemplatedResource = [ResourceKey, ...any[]];
type ResourceDictionary = Record<string, ResourceKey | TemplatedResource>;

const defaultResources: SkyResourceType = {};

function getDefaultObs(): Observable<SkyResourceType> {
  return observableOf(defaultResources);
}

/**
 * An Angular service for interacting with resource strings.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyAppResourcesService {
  #resourcesObsCache: Record<string, Observable<SkyResourceType>> = {};
  #httpObsCache: Record<string, Observable<SkyResourceType>> = {};

  #http: HttpClient;
  #assets: SkyAppAssetsService | undefined;
  #localeProvider: SkyAppLocaleProvider;
  #resourceNameProvider: SkyAppResourceNameProvider | undefined;

  constructor(
    http: HttpClient,
    @Optional()
    @Inject(forwardRef(() => SkyAppAssetsService))
    assets: SkyAppAssetsService,
    @Optional() localeProvider: SkyAppLocaleProvider,
    @Optional() resourceNameProvider: SkyAppResourceNameProvider,
  ) {
    this.#http = http;
    this.#assets = assets;
    // Locale provider is provided at `root`. The `Optional` here is for unit test compatibility.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.#localeProvider = localeProvider!;
    this.#resourceNameProvider = resourceNameProvider;
  }

  /**
   * Gets a resource string based on its name.
   * @param name The name of the resource string.
   * @param args Any templated args.
   */
  public getString(name: string, ...args: any[]): Observable<string> {
    const localeObs: Observable<SkyAppLocaleInfo> =
      this.#localeProvider.getLocaleInfo();
    return this.#getStringForLocaleInfoObservable(localeObs, name, ...args);
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

  /**
   * Gets a resource string for a specific locale based on its name.
   * @param localeInfo The locale to use.
   * @param name The name of the resource string.
   * @param args Any templated args.
   */
  public getStringForLocale(
    localeInfo: SkyAppLocaleInfo,
    name: string,
    ...args: any[]
  ): Observable<string> {
    return this.#getStringForLocaleInfoObservable(
      observableOf(localeInfo),
      name,
      ...args,
    );
  }

  #getStringForLocaleInfoObservable(
    localeInfoObs: Observable<SkyAppLocaleInfo>,
    name: string,
    ...args: any[]
  ): Observable<string> {
    const resourcesObs: Observable<any> = localeInfoObs.pipe(
      switchMap((localeInfo) => {
        let obs: Observable<any>;

        // Use default locale if one not provided
        const locale = localeInfo.locale || this.#localeProvider.defaultLocale;

        if (this.#resourcesObsCache[locale]) {
          return this.#resourcesObsCache[locale];
        }

        const resourcesUrl =
          this.#getUrlForLocale(locale) ||
          // Try falling back to the non-region-specific language.
          this.#getUrlForLocale(locale.substring(0, 2)) ||
          // Finally fall back to the default locale.
          this.#getUrlForLocale(this.#localeProvider.defaultLocale);

        if (resourcesUrl) {
          if (!this.#httpObsCache[resourcesUrl]) {
            this.#httpObsCache[resourcesUrl] = this.#http
              .get<SkyResourceType>(resourcesUrl)
              .pipe(
                share({
                  connector: () => new ReplaySubject(1),
                  resetOnError: false,
                  resetOnComplete: false,
                  resetOnRefCountZero: false,
                }),
                catchError(() => {
                  // The resource file for the specified locale failed to load;
                  // fall back to the default locale if it differs from the specified
                  // locale.
                  const defaultResourcesUrl = this.#getUrlForLocale(
                    this.#localeProvider.defaultLocale,
                  );

                  if (
                    defaultResourcesUrl &&
                    defaultResourcesUrl !== resourcesUrl
                  ) {
                    return this.#http.get<SkyResourceType>(defaultResourcesUrl);
                  }

                  return getDefaultObs();
                }),
              );
          }
          obs = this.#httpObsCache[resourcesUrl];
        } else {
          obs = getDefaultObs();
        }
        this.#resourcesObsCache[locale] = obs;

        return obs;
      }),
      // Don't keep trying after a failed attempt to load resources, or else
      // impure pipes like resources pipe that call this service will keep
      // firing requests indefinitely every few milliseconds.
      catchError(() => getDefaultObs()),
    );

    const mappedNameObs = this.#resourceNameProvider
      ? this.#resourceNameProvider.getResourceName(name)
      : observableOf(name);

    return forkJoin([mappedNameObs, resourcesObs]).pipe(
      map(([mappedName, resources]): string => {
        let resource: { message: string } | undefined = undefined;

        if (mappedName in resources) {
          resource = resources[mappedName];
        } else if (name in resources) {
          resource = resources[name];
        }

        if (resource) {
          return Format.formatText(resource.message, ...args);
        }

        return name;
      }),
    );
  }

  #getUrlForLocale(locale: string): string | undefined {
    return this.#assets?.getUrl(
      `locales/resources_${locale.replace('-', '_')}.json`,
    );
  }
}
