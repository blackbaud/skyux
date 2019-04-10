import {
  SkyInlineFormButtonConfig
} from './inline-form-button-config';

import {
  SkyInlineFormButtonLayout
} from './inline-form-button-layout';

export interface SkyInlineFormConfig {
  buttonLayout: SkyInlineFormButtonLayout;
  buttons?: SkyInlineFormButtonConfig[];
}
