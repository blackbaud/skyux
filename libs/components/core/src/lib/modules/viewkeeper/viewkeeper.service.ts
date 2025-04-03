import { Injectable, Optional, RendererFactory2, inject } from '@angular/core';

import { SkyViewkeeper } from './viewkeeper';
import { SkyViewkeeperHostOptions } from './viewkeeper-host-options';
import { SkyViewkeeperOptions } from './viewkeeper-options';

/**
 * Provides methods for creating and destroying viewkeeper instances.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyViewkeeperService {
  #hostOptions: SkyViewkeeperHostOptions | undefined;
  readonly #renderer = inject(RendererFactory2).createRenderer(undefined, null);

  constructor(@Optional() hostOptions?: SkyViewkeeperHostOptions) {
    this.#hostOptions = hostOptions;
  }

  /**
   *
   * @param options Creates a viewkeeper instance, applying host options where applicable.
   */
  public create(options: SkyViewkeeperOptions): SkyViewkeeper {
    options = Object.assign(
      { renderer: this.#renderer },
      this.#hostOptions || {},
      options,
    );

    return new SkyViewkeeper(options);
  }

  /**
   * Destroys a viewkeeper instance.
   * @param vk Viewkeeper instance to destroy.
   */
  public destroy(vk: SkyViewkeeper): void {
    vk.destroy();
  }
}
