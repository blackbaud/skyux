import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyUrlValidationModule } from '@skyux/validation';

import { UrlValidationControlValidatorComponent } from './control-validator/url-validation-control-validator.component';
import { UrlValidationDirectiveComponent } from './directive/url-validation-directive.component';
import { UrlValidationRoutingModule } from './url-validation-routing.module';

@NgModule({
  declarations: [
    UrlValidationControlValidatorComponent,
    UrlValidationDirectiveComponent,
  ],
  exports: [
    UrlValidationControlValidatorComponent,
    UrlValidationDirectiveComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkySummaryActionBarModule,
    UrlValidationRoutingModule,
    SkyIdModule,
    SkyUrlValidationModule,
  ],
})
export class UrlValidationModule {
  public static routes = UrlValidationRoutingModule.routes;
}
