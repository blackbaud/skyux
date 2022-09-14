import { Injectable } from '@angular/core';

import { SkyInputBoxPopulateArgs } from './input-box-populate-args';
import { SkyInputBoxComponent } from './input-box.component';

/**
 * @internal
 */
@Injectable()
export class SkyInputBoxHostService {
  #host: SkyInputBoxComponent | undefined;

  public init(host: SkyInputBoxComponent): void {
    this.#host = host;
  }

  public populate(args: SkyInputBoxPopulateArgs): void {
    if (!this.#host) {
      throw new Error('Input box host has not been initialized');
    }

    this.#host.populate(args);
  }
}
