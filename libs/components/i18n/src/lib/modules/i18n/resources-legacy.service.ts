import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional, forwardRef } from '@angular/core';
import { SkyAppAssetsService } from '@skyux/assets';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { SkyAppLocaleInfo } from './locale-info';
import { SkyAppLocaleProvider } from './locale-provider';
import { SkyAppResourceNameProvider } from './resource-name-provider';
import { SkyAppResourcesService } from './resources.service';

type ResourceKey = string;
type TemplatedResource = [ResourceKey, ...any[]];
type ResourceDictionary = Record<string, ResourceKey | TemplatedResource>;

/**
 * An Angular service for interacting with resource strings.
 *
 * @deprecated This service is deprecated. Use `SkyAppResourcesService` instead.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyAppResourcesLegacyService {
  readonly #resourcesService: SkyAppResourcesService;

  /* eslint-disable @angular-eslint/prefer-inject -- constructor injection is required to maintain the public API for consumers who may instantiate this service directly (e.g. `new SkyAppResourcesService(...)`) */
  constructor(
    http: HttpClient,
    @Optional()
    @Inject(forwardRef(() => SkyAppAssetsService))
    assets: SkyAppAssetsService,
    @Optional() localeProvider: SkyAppLocaleProvider,
    @Optional() resourceNameProvider: SkyAppResourceNameProvider,
  ) {
    this.#resourcesService = new SkyAppResourcesService(
      http,
      assets,
      localeProvider,
      resourceNameProvider,
    );
  }

  /**
   * Gets a resource string based on its name. Emits once and completes.
   * @param name The name of the resource string.
   * @param args Any templated args.
   * @deprecated This method is deprecated. Use `SkyAppResourcesService.getString()` instead.
   */
  public getString(name: string, ...args: any[]): Observable<string> {
    return this.#resourcesService.getString(name, ...args).pipe(take(1));
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
   * @deprecated This method is deprecated. Use `SkyAppResourcesService.getStrings()` instead.
   */
  public getStrings<T extends ResourceDictionary>(
    dictionary: T,
  ): Observable<{ [K in keyof T]: string }> {
    return this.#resourcesService.getStrings(dictionary).pipe(take(1));
  }

  /**
   * Gets a resource string for a specific locale based on its name. Emits once and completes.
   * @param localeInfo The locale to use.
   * @param name The name of the resource string.
   * @param args Any templated args.
   * @deprecated This method is deprecated. Use `SkyAppResourcesService.getStringForLocale()` instead.
   */
  public getStringForLocale(
    localeInfo: SkyAppLocaleInfo,
    name: string,
    ...args: any[]
  ): Observable<string> {
    return this.#resourcesService
      .getStringForLocale(localeInfo, name, ...args)
      .pipe(take(1));
  }
}
