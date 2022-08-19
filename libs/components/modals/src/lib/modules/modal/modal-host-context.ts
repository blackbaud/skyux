import { Inject, Injectable, InjectionToken } from '@angular/core';

interface SkyModalHostContextArgs {
  teardownCallback: () => void;
}

const MODAL_HOST_CONTEXT_ARGS = new InjectionToken<SkyModalHostContextArgs>(
  'SkyModalHostContextArgs'
);

/**
 * Provided by the modal service to give the modal host
 * component additional context and features.
 * @internal
 */
@Injectable()
export class SkyModalHostContext {
  constructor(
    @Inject(MODAL_HOST_CONTEXT_ARGS) public args: SkyModalHostContextArgs
  ) {}
}
