/* eslint-disable @nx/enforce-module-boundaries */
import {
  SkyConfirmCloseEventArgs,
  SkyConfirmConfig,
  SkyConfirmInstance,
  SkyConfirmServiceInterface,
} from '@skyux/modals';

import { SkyConfirmTestSubject } from './confirm-test-subject';
import { SkyConfirmTestingController } from './confirm-testing.controller';

/**
 * @internal
 */
export class SkyConfirmTestingService
  implements SkyConfirmServiceInterface, SkyConfirmTestingController
{
  #testSubject: SkyConfirmTestSubject | undefined;

  public cancel(): void {
    this.close({ action: 'cancel' });
  }

  public ok(): void {
    this.close({ action: 'ok' });
  }

  public close(args: SkyConfirmCloseEventArgs): void {
    this.#assertConfirmOpen(this.#testSubject);
    this.#testSubject.instance.close(args);
    this.#testSubject = undefined;
  }

  public expectClosed(): void {
    this.#assertConfirmClosed(this.#testSubject);
  }

  public expectOpen(): SkyConfirmTestSubject {
    this.#assertConfirmOpen(this.#testSubject);
    return this.#testSubject;
  }

  public open(config: SkyConfirmConfig): SkyConfirmInstance {
    this.#assertConfirmClosed(this.#testSubject);

    const instance = new SkyConfirmInstance();
    this.#testSubject = { config, instance };
    return instance;
  }

  #assertConfirmClosed(
    value: SkyConfirmTestSubject | undefined,
  ): asserts value is undefined {
    if (value !== undefined) {
      throw new Error('A confirm is open but is expected to be closed.');
    }

    return;
  }

  #assertConfirmOpen(
    value: SkyConfirmTestSubject | undefined,
  ): asserts value is SkyConfirmTestSubject {
    if (value === undefined) {
      throw new Error(
        'A confirm instance is expected to be open but cannot be found.',
      );
    }

    return;
  }
}
