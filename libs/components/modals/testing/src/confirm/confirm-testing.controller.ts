/* eslint-disable @nx/enforce-module-boundaries */
import { SkyConfirmCloseEventArgs } from '@skyux/modals';

import { SkyConfirmTestSubject } from './confirm-test-subject';

export abstract class SkyConfirmTestingController {
  public abstract cancel(): void;
  public abstract expectOpen(): SkyConfirmTestSubject;
  public abstract close(args: SkyConfirmCloseEventArgs): void;
  public abstract ok(): void;
}
