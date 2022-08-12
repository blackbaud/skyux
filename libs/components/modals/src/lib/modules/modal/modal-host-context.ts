import { Injectable } from '@angular/core';

/**
 * Provided by the modal service to give the modal host
 * component additional context and features.
 * @internal
 */
@Injectable()
export class SkyModalHostContext {
  constructor(public teardownCallback: () => void) {}
}
