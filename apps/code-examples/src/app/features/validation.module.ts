import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmailValidationDemoComponent as EmailValidationControlValidatorDemoComponent } from '../code-examples/validation/email-validation/control-validator/email-validation-demo.component';
import { EmailValidationDemoModule as EmailValidationControlValidatorDemoModule } from '../code-examples/validation/email-validation/control-validator/email-validation-demo.module';
import { EmailValidationDemoComponent as EmailValidationDirectiveDemoComponent } from '../code-examples/validation/email-validation/directive/email-validation-demo.component';
import { EmailValidationDemoModule as EmailValidationDirectiveDemoModule } from '../code-examples/validation/email-validation/directive/email-validation-demo.module';
import { UrlValidationDemoComponent as UrlValidationControlValidatorDemoComponent } from '../code-examples/validation/url-validation/control-validator/url-validation-demo.component';
import { UrlValidationDemoModule as UrlValidationControlValidatorDemoModule } from '../code-examples/validation/url-validation/control-validator/url-validation-demo.module';
import { UrlValidationDemoComponent as UrlValidationDirectiveDemoComponent } from '../code-examples/validation/url-validation/directive/url-validation-demo.component';
import { UrlValidationDemoModule as UrlValidationDirectiveDemoModule } from '../code-examples/validation/url-validation/directive/url-validation-demo.module';

const routes: Routes = [
  {
    path: 'email/control-validator',
    component: EmailValidationControlValidatorDemoComponent,
  },
  {
    path: 'email/directive',
    component: EmailValidationDirectiveDemoComponent,
  },
  {
    path: 'url/control-validator',
    component: UrlValidationControlValidatorDemoComponent,
  },
  {
    path: 'url/directive',
    component: UrlValidationDirectiveDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidationRoutingModule {}

@NgModule({
  imports: [
    EmailValidationControlValidatorDemoModule,
    EmailValidationDirectiveDemoModule,
    UrlValidationControlValidatorDemoModule,
    UrlValidationDirectiveDemoModule,
    ValidationRoutingModule,
  ],
})
export class ValidationModule {}
