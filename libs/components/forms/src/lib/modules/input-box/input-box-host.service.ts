import { Injectable } from '@angular/core';

import { SkyInputBoxPopulateArgs } from './input-box-populate-args';
import { SkyInputBoxComponent } from './input-box.component';

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
