import { HttpClient } from '@angular/common/http';
import { forwardRef, Inject, Injectable, Optional } from '@angular/core';
import { SkyAppAssetsService } from '@skyux/assets';

import {
  combineLatest,
  defer,
  EMPTY,
  Observable,
  of as observableOf,
  ReplaySubject,
  share,
} from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';

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
  readonly #resourcesObsCache: Record<string, Observable<SkyResourceType>> = {};
  readonly #httpObsCache: Record<string, Observable<SkyResourceType>> = {};

  #http: HttpClient;
  #assets: SkyAppAssetsService | undefined;
  #localeProvider: SkyAppLocaleProvider;
  #resourceNameProvider: SkyAppResourceNameProvider | undefined;

  /* eslint-disable @angular-eslint/prefer-inject -- constructor injection is required to maintain the public API for consumers who may instantiate this service directly (e.g. `new SkyAppResourcesService(...)`) */
  constructor(
    http: HttpClient,
    @Optional()
    @Inject(forwardRef(() => SkyAppAssetsService))
    assets: SkyAppAssetsService,
    @Optional() localeProvider: SkyAppLocaleProvider,
    @Optional() resourceNameProvider: SkyAppResourceNameProvider,
  ) {
    /* eslint-enable @angular-eslint/prefer-inject */
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
  public getString(name: string, ...args: unknown[]): Observable<string> {
    return this.#localeProvider.getLocaleInfo().pipe(
      distinctUntilChanged((a, b) => a.locale === b.locale),
      switchMap((localeInfo) =>
        this.getStringForLocale(localeInfo, name, ...args).pipe(
          catchError(() => observableOf(name)),
        ),
      ),
      // Last resort in case the locale provider itself errors.
      catchError(() => observableOf(name)),
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
    const entries = Object.entries(dictionary).map(([objKey, resource]) => {
      const [name, ...args] = Array.isArray(resource) ? resource : [resource];
      return { objKey, name, args };
    });

    if (entries.length === 0) {
      return EMPTY;
    }

    // If resolution fails (e.g. the locale provider errors), fall back to a
    // dictionary mapping each object key to its raw resource key name, which
    // matches `#getResourceString`'s behavior when no resources are available.
    const getFallbackDictionary = (): { [K in keyof T]: string } =>
      Object.fromEntries(entries.map(({ objKey, name }) => [objKey, name])) as {
        [K in keyof T]: string;
      };

    const resourcesObs = this.#localeProvider.getLocaleInfo().pipe(
      distinctUntilChanged((a, b) => a.locale === b.locale),
      switchMap((localeInfo) => this.#getLocaleResourceObservable(localeInfo)),
    );
    const mappedNames$ = combineLatest(
      entries.map(({ name }) => this.#getMappedNameObs(name)),
    );

    return combineLatest([mappedNames$, resourcesObs]).pipe(
      map(
        ([mappedNames, resources]): { [K in keyof T]: string } =>
          Object.fromEntries(
            entries.map(({ name, objKey, args }, i) => [
              objKey,
              this.#getResourceString(resources, name, mappedNames[i], ...args),
            ]),
          ) as { [K in keyof T]: string },
      ),
      catchError(() => observableOf(getFallbackDictionary())),
    );
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
    ...args: unknown[]
  ): Observable<string> {
    // Deferred so that a synchronous error (e.g. a throwing
    // `SkyAppAssetsService.getUrl()`) surfaces as an error on the observable
    // instead of throwing synchronously when this method is called.
    const resourcesObs = defer(() =>
      this.#getLocaleResourceObservable(localeInfo),
    ).pipe(catchError(() => getDefaultObs()));
    const mappedNameObs = this.#getMappedNameObs(name);
    return combineLatest([mappedNameObs, resourcesObs]).pipe(
      map(([mappedName, resources]): string =>
        this.#getResourceString(resources, name, mappedName, ...args),
      ),
    );
  }

  #getLocaleResourceObservable(
    localeInfo: SkyAppLocaleInfo,
  ): Observable<SkyResourceType> {
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
      this.#httpObsCache[resourcesUrl] ||= this.#http
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

            if (defaultResourcesUrl && defaultResourcesUrl !== resourcesUrl) {
              return this.#http.get<SkyResourceType>(defaultResourcesUrl).pipe(
                // Don't keep trying after a failed attempt to load resources, or else
                // impure pipes like resources pipe that call this service will keep
                // firing requests indefinitely every few milliseconds.
                catchError(() => getDefaultObs()),
              );
            }

            return getDefaultObs();
          }),
        );
      obs = this.#httpObsCache[resourcesUrl];
    } else {
      obs = getDefaultObs();
    }
    this.#resourcesObsCache[locale] = obs;

    return obs;
  }

  #getResourceString(
    resources: SkyResourceType,
    name: string,
    mappedName: string,
    ...args: unknown[]
  ): string {
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
  }

  #getMappedNameObs(name: string): Observable<string> {
    return this.#resourceNameProvider
      ? this.#resourceNameProvider.getResourceName(name)
      : observableOf(name);
  }

  #getUrlForLocale(locale: string): string | undefined {
    return this.#assets?.getUrl(
      `locales/resources_${locale.replace('-', '_')}.json`,
    );
  }
}
