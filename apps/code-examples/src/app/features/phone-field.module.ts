import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PhoneFieldDemoComponent as PhoneFieldBasicDemoComponent } from '../code-examples/phone-field/phone-field/basic/phone-field-demo.component';
import { PhoneFieldDemoModule as PhoneFieldBasicDemoModule } from '../code-examples/phone-field/phone-field/basic/phone-field-demo.module';

const routes: Routes = [
  {
    path: 'phone-field/basic',
    component: PhoneFieldBasicDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhoneRoutingModule {}

@NgModule({
  imports: [PhoneRoutingModule, PhoneFieldBasicDemoModule],
})
export class PhoneModule {}
