/* eslint-disable @nx/enforce-module-boundaries */
import { Provider } from '@angular/core';
import {
  SkyConfirmCloseEventArgs,
  SkyConfirmConfig,
  SkyConfirmInstance,
  SkyConfirmService,
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
  }

  public expectOpen(): SkyConfirmTestSubject {
    this.#assertConfirmOpen(this.#testSubject);
    return this.#testSubject;
  }

  public open(config: SkyConfirmConfig): SkyConfirmInstance {
    if (this.#testSubject !== undefined) {
      throw new Error('A confirm is already open.');
    }

    const instance = new SkyConfirmInstance();
    this.#testSubject = { config, instance };
    return instance;
  }

  #assertConfirmOpen(
    value: SkyConfirmTestSubject | undefined,
  ): asserts value is SkyConfirmTestSubject {
    if (value === undefined) {
      throw new Error('Confirm is not open.');
    }

    return;
  }
}

/**
 * @internal
 */
export function provideConfirmTesting(): Provider[] {
  return [
    SkyConfirmTestingService,
    {
      provide: SkyConfirmService,
      useExisting: SkyConfirmTestingService,
    },
    {
      provide: SkyConfirmTestingController,
      useExisting: SkyConfirmTestingService,
    },
  ];
}
