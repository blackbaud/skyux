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
  constructor(@Optional() private hostOptions?: SkyViewkeeperHostOptions) {}

  /**
   *
   * @param options Creates a viewkeeper instance, applying host options where applicable.
   */
  public create(options: SkyViewkeeperOptions): SkyViewkeeper {
    options = Object.assign({}, this.hostOptions || {}, options);

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
