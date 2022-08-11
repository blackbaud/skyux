import { Injectable } from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyModalHostContext {
  constructor(public teardownCallback: () => void) {}
}
