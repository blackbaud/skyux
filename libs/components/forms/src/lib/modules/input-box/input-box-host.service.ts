import { Injectable } from '@angular/core';

import { SkyInputBoxComponent } from './input-box.component';

import { SkyInputBoxPopulateArgs } from './input-box-populate-args';

/**
 * @internal
 */
@Injectable()
export class SkyInputBoxHostService {
  private host: SkyInputBoxComponent;

  public init(host: SkyInputBoxComponent): void {
    this.host = host;
  }

  public populate(args: SkyInputBoxPopulateArgs): void {
    this.host.populate(args);
  }
}
