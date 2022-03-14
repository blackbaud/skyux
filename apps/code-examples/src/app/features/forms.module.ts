import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CheckboxDemoComponent as CheckboxBasicDemoComponent } from '../code-examples/forms/checkbox/basic/checkbox-demo.component';
import { CheckboxDemoModule as CheckboxBasicDemoModule } from '../code-examples/forms/checkbox/basic/checkbox-demo.module';

const routes: Routes = [
  {
    path: 'checkbox/basic',
    component: CheckboxBasicDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormsRoutingModule {}

@NgModule({
  imports: [CheckboxBasicDemoModule, FormsRoutingModule],
})
export class FormsModule {}
