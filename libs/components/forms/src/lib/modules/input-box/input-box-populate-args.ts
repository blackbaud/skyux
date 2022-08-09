import { TemplateRef } from '@angular/core';

/**
 * @internal
 */
export interface SkyInputBoxPopulateArgs {
  inputTemplate: TemplateRef<unknown>;

  buttonsTemplate?: TemplateRef<unknown>;

  buttonsLeftTemplate?: TemplateRef<unknown>;

  buttonsInsetTemplate?: TemplateRef<unknown>;

  iconsInsetTemplate?: TemplateRef<unknown>;

  iconsInsetLeftTemplate?: TemplateRef<unknown>;
}
