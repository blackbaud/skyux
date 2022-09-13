import { Inject, Injectable } from '@angular/core';

import { SkyModalHostContextArgs } from './modal-host-context-args';

/**
 * Provided by the modal service to give the modal host
 * component additional context and features.
 * @internal
 */
@Injectable()
export class SkyModalHostContext {
  constructor(
    @Inject('SkyModalHostContextArgs') public args: SkyModalHostContextArgs
  ) {}
}
