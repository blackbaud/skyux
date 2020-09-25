import {
  TemplateRef
} from '@angular/core';

/**
 * @internal
 */
export interface SkyInputBoxPopulateArgs {

  inputTemplate: TemplateRef<any>;

  buttonsTemplate?: TemplateRef<any>;

  buttonsLeftTemplate?: TemplateRef<any>;

  buttonsInsetTemplate?: TemplateRef<any>;

}
