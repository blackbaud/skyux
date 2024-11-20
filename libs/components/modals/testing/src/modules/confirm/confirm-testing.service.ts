import {
  SkyConfirmButtonConfig,
  SkyConfirmCloseEventArgs,
  SkyConfirmConfig,
  SkyConfirmInstance,
  SkyConfirmServiceInterface,
  SkyConfirmType,
} from '@skyux/modals';

import { SkyConfirmTestingController } from './confirm-testing.controller';

interface TestSubject {
  buttons: SkyConfirmButtonConfig[];
  config: SkyConfirmConfig;
  instance: SkyConfirmInstance;
}

function assertConfirmOpen(
  value: TestSubject | undefined,
): asserts value is TestSubject {
  if (value === undefined) {
    throw new Error('A confirm dialog is expected to be open but is closed.');
  }

  return;
}

function assertConfirmClosed(
  value: TestSubject | undefined,
): asserts value is undefined {
  if (value !== undefined) {
    throw new Error('A confirm dialog is expected to be closed but is open.');
  }

  return;
}

function isButtonConfigArray(val: unknown): val is SkyConfirmButtonConfig[] {
  return (
    Array.isArray(val) && (val.length === 0 || val[0].action !== undefined)
  );
}

function buttonConfigMatches(
  actual: SkyConfirmButtonConfig,
  expected: SkyConfirmButtonConfig,
): boolean {
  return (
    expected.action === actual.action &&
    expected.text === actual.text &&
    expected.styleType === actual.styleType
  );
}

/**
 * @internal
 */
export class SkyConfirmTestingService
  extends SkyConfirmTestingController
  implements SkyConfirmServiceInterface
{
  #testSubject: TestSubject | undefined;

  public cancel(): void {
    this.close({ action: 'cancel' });
  }

  public ok(): void {
    this.close({ action: 'ok' });
  }

  public close(args: SkyConfirmCloseEventArgs): void {
    assertConfirmOpen(this.#testSubject);

    const isActionPermitted = this.#testSubject?.buttons.some(
      (b) => b.action === args.action,
    );

    if (isActionPermitted) {
      this.#testSubject.instance.close(args);
      this.#testSubject = undefined;
    } else {
      throw new Error(
        `The confirm dialog does not have a button configured for the "${args.action}" action.`,
      );
    }
  }

  public expectNone(): void {
    assertConfirmClosed(this.#testSubject);
  }

  public expectOpen(expectedConfig: SkyConfirmConfig): void {
    assertConfirmOpen(this.#testSubject);

    const actualConfig = this.#testSubject.config;

    for (const [key, expectedValue] of Object.entries(expectedConfig)) {
      const k = key as keyof typeof expectedConfig;
      const actualValue = actualConfig[k];

      if (
        isButtonConfigArray(expectedValue) &&
        isButtonConfigArray(actualValue)
      ) {
        if (expectedValue.length !== actualValue.length) throwDetailedError();

        expectedValue.forEach((expectedButton, index) => {
          if (!buttonConfigMatches(expectedButton, actualValue[index])) {
            throwDetailedError();
          }
        });
      } else if (actualValue !== expectedValue) {
        throwDetailedError();
      }
    }

    function throwDetailedError(): never {
      throw new Error(`Expected a confirm dialog to be open with a specific configuration.
Expected:
${JSON.stringify(expectedConfig, undefined, 2)}
Actual:
${JSON.stringify(actualConfig, undefined, 2)}
`);
    }
  }

  public open(config: SkyConfirmConfig): SkyConfirmInstance {
    assertConfirmClosed(this.#testSubject);

    const instance = new SkyConfirmInstance();
    const testSubject: TestSubject = {
      buttons: [],
      config,
      instance,
    };

    switch (config.type) {
      case SkyConfirmType.Custom:
        config.buttons?.forEach((b) => {
          testSubject.buttons.push({ action: b.action, text: b.text });
        });
        break;

      case SkyConfirmType.OK:
      default:
        testSubject.buttons.push({ action: 'ok', text: 'Ok' });
        testSubject.buttons.push({ action: 'cancel', text: 'Cancel' });
        break;
    }

    this.#testSubject = testSubject;

    return instance;
  }
}
