import { Injectable, inject } from '@angular/core';

import { SkyModalHostContextArgs } from './modal-host-context-args';

/**
 * Provided by the modal service to give the modal host
 * component additional context and features.
 * @internal
 */
@Injectable()
export class SkyModalHostContext {
  public readonly args: SkyModalHostContextArgs = inject(
    'SkyModalHostContextArgs' as any,
  );
}
