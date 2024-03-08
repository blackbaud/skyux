/* eslint-disable @nx/enforce-module-boundaries */
import {
  SkyConfirmCloseEventArgs,
  SkyConfirmConfig,
  SkyConfirmInstance,
  SkyConfirmServiceInterface,
} from '@skyux/modals';

import { SkyConfirmTestingController } from './confirm-testing.controller';

interface TestSubject {
  config: SkyConfirmConfig;
  instance: SkyConfirmInstance;
}

/**
 * @internal
 */
export class SkyConfirmTestingService
  implements SkyConfirmServiceInterface, SkyConfirmTestingController
{
  #testSubject: TestSubject | undefined;

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

  public expectNone(): void {
    this.#assertConfirmClosed(this.#testSubject);
  }

  public expectOpen(expectedConfig: SkyConfirmConfig): void {
    this.#assertConfirmOpen(this.#testSubject);

    const actualConfig = this.#testSubject.config;

    for (const [key, value] of Object.entries(expectedConfig)) {
      const k = key as keyof typeof expectedConfig;

      if (actualConfig[k] !== value) {
        throw new Error(`Expected a confirm instance to be open with a specific configuration.
Expected:
${JSON.stringify(expectedConfig, undefined, 2)}
Actual:
${JSON.stringify(actualConfig, undefined, 2)}
`);
      }
    }
  }

  public open(config: SkyConfirmConfig): SkyConfirmInstance {
    this.#assertConfirmClosed(this.#testSubject);

    const instance = new SkyConfirmInstance();
    this.#testSubject = { config, instance };
    return instance;
  }

  #assertConfirmClosed(
    value: TestSubject | undefined,
  ): asserts value is undefined {
    if (value !== undefined) {
      throw new Error('A confirm is open but is expected to be closed.');
    }

    return;
  }

  #assertConfirmOpen(
    value: TestSubject | undefined,
  ): asserts value is TestSubject {
    if (value === undefined) {
      throw new Error(
        'A confirm instance is expected to be open but cannot be found.',
      );
    }

    return;
  }
}
