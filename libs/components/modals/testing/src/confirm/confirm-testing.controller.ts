/* eslint-disable @nx/enforce-module-boundaries */
import { SkyConfirmCloseEventArgs, SkyConfirmConfig } from '@skyux/modals';

export abstract class SkyConfirmTestingController {
  public abstract cancel(): void;
  public abstract expectNone(): void;
  public abstract expectOpen(config: SkyConfirmConfig): void;
  public abstract close(args: SkyConfirmCloseEventArgs): void;
  public abstract ok(): void;
}
