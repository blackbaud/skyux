import { Injectable, inject } from '@angular/core';

import { SkyModalHostContextArgs } from './modal-host-context-args';
import { SKY_MODAL_HOST_CONTEXT_ARGS } from './modal-host-context-args-token';

/**
 * Provided by the modal service to give the modal host
 * component additional context and features.
 * @internal
 */
@Injectable()
export class SkyModalHostContext {
  public readonly args: SkyModalHostContextArgs = inject(
    SKY_MODAL_HOST_CONTEXT_ARGS,
  );
}
