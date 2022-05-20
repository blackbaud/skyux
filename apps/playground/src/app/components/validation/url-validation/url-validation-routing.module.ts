import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UrlValidationControlValidatorComponent } from './control-validator/url-validation-control-validator.component';
import { UrlValidationDirectiveComponent } from './directive/url-validation-directive.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'control-validator',
        component: UrlValidationControlValidatorComponent,
      },
      {
        path: 'directive',
        component: UrlValidationDirectiveComponent,
      },
    ]),
  ],
})
export class UrlValidationRoutingModule {}
