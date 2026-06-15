import { Injectable, Optional } from '@angular/core';

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

  // eslint-disable-next-line @angular-eslint/prefer-inject -- constructor injection is required to maintain the public API for consumers who may instantiate this service directly (e.g. `new SkyViewkeeperService(...)`).
  constructor(@Optional() hostOptions?: SkyViewkeeperHostOptions) {
    this.#hostOptions = hostOptions;
  }

  /**
   *
   * @param options Creates a viewkeeper instance, applying host options where applicable.
   */
  public create(options: SkyViewkeeperOptions): SkyViewkeeper {
    options = Object.assign({}, this.#hostOptions || {}, options);

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
