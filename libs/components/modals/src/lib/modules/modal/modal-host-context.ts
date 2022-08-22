import { Inject, Injectable } from '@angular/core';

interface SkyModalHostContextArgs {
  teardownCallback: () => void;
}

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
