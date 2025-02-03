import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SkyAutonumericDirective } from './autonumeric.directive';

/**
 * @docsIncludeIds SkyAutonumericDirective, SkyAutonumericOptions, SkyAutonumericOptionsProvider, AutonumericPresetExampleComponent, AutonumericCurrencyExampleComponent, AutonumericInternationalFormattingExampleComponent, AutonumericOptionsProviderExampleComponent
 */
@NgModule({
  declarations: [SkyAutonumericDirective],
  imports: [FormsModule, ReactiveFormsModule],
  exports: [SkyAutonumericDirective],
})
export class SkyAutonumericModule {}
