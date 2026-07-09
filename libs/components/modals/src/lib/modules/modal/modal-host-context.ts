import { Inject, Injectable } from '@angular/core';

import { SkyModalHostContextArgs } from './modal-host-context-args';

/**
 * Provided by the modal service to give the modal host
 * component additional context and features.
 * @internal
 */
@Injectable()
export class SkyModalHostContext {
  /* eslint-disable @angular-eslint/prefer-inject -- this class is always constructed manually via `new SkyModalHostContext(args)` and registered as a `useValue` provider; Angular's DI never invokes this constructor itself, so the args must be accepted directly. `@Inject` is required here because `SkyModalHostContextArgs` is a TS interface with no runtime DI token, so Angular's compiler needs the explicit string token to validate the constructor even though it's never actually resolved via DI. */
  constructor(
    @Inject('SkyModalHostContextArgs') public args: SkyModalHostContextArgs,
  ) {}
  /* eslint-enable @angular-eslint/prefer-inject */
}
