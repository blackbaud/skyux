import { SkyConfirmButtonConfig } from './confirm-button-config';

import { SkyConfirmConfig } from './confirm-config';

import { SkyConfirmType } from './confirm-type';

/* istanbul ignore next */
export class SkyConfirmModalContext implements SkyConfirmConfig {
  public message: string;
  public body: string;
  public buttons: SkyConfirmButtonConfig[];
  public preserveWhiteSpace: boolean;
  public type: SkyConfirmType;
}
