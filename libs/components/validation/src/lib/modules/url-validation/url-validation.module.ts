import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SkyUrlValidationDirective } from './url-validation.directive';

/**
 * @docsIncludeIds SkyUrlValidationDirective, SkyUrlValidationOptions
 */
@NgModule({
  declarations: [SkyUrlValidationDirective],
  imports: [FormsModule],
  exports: [SkyUrlValidationDirective],
})
export class SkyUrlValidationModule {}
