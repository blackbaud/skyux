import { Inject, Injectable, Optional } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { SkyLibResources } from './lib-resources';
import { SkyLibResourcesProvider } from './lib-resources-provider';
import { SKY_LIB_RESOURCES_PROVIDERS } from './lib-resources-providers-token';
import { SkyLibResourcesService } from './lib-resources.service';
import { SkyAppLocaleInfo } from './locale-info';
import { SkyAppLocaleProvider } from './locale-provider';
import { SkyAppResourceNameProvider } from './resource-name-provider';

type ResourceKey = string;
type TemplatedResource = [ResourceKey, ...unknown[]];
type ResourceDictionary = Record<string, ResourceKey | TemplatedResource>;

/**
 * An Angular service for interacting with library resource strings.
 *
 * @deprecated This service is deprecated. Use `SkyLibResourcesService` instead.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyLibResourcesLegacyService {
  readonly #resourcesService: SkyLibResourcesService;

  /* eslint-disable @angular-eslint/prefer-inject -- constructor injection is required to maintain the public API for consumers who may instantiate this service directly (e.g. `new SkyLibResourcesLegacyService(...)`) */
  constructor(
    localeProvider: SkyAppLocaleProvider,
    @Optional()
    @Inject(SKY_LIB_RESOURCES_PROVIDERS)
    providers?: SkyLibResourcesProvider[],
    @Optional() resourceNameProvider?: SkyAppResourceNameProvider,
  ) {
    /* eslint-enable @angular-eslint/prefer-inject */
    this.#resourcesService = new SkyLibResourcesService(
      localeProvider,
      providers,
      resourceNameProvider,
    );
  }

  /**
   * Adds locale resources to be used by library components.
   *
   * @deprecated This method is deprecated. Use `SkyLibResourcesService.addResources()` instead.
   */
  public static addResources(
    localeResources: Record<string, SkyLibResources>,
  ): void {
    SkyLibResourcesService.addResources(localeResources);
  }

  /**
   * Gets a resource string based on its name. Emits once and completes.
   * @param name The name of the resource string.
   * @param args Any templated args.
   * @deprecated This method is deprecated. Use `SkyLibResourcesService.getString()` instead.
   */
  public getString(name: string, ...args: unknown[]): Observable<string> {
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
   * @deprecated This method is deprecated. Use `SkyLibResourcesService.getStrings()` instead.
   */
  public getStrings<T extends ResourceDictionary>(
    dictionary: T,
  ): Observable<{ [K in keyof T]: string }> {
    return this.#resourcesService.getStrings(dictionary).pipe(take(1));
  }

  /**
   * Gets a resource string for a specific locale based on its name.
   * @param info The locale to use.
   * @param name The name of the resource string.
   * @param args Any templated args.
   * @deprecated This method is deprecated. Use `SkyLibResourcesService.getStringForLocale()` instead.
   */
  public getStringForLocale(
    info: SkyAppLocaleInfo,
    name: string,
    ...args: unknown[]
  ): string {
    return this.#resourcesService.getStringForLocale(info, name, ...args);
  }
}
