import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InlineFormDemoComponent } from '../code-examples/inline-form/inline-form/basic/inline-form-demo.component';
import { InlineFormDemoModule } from '../code-examples/inline-form/inline-form/basic/inline-form-demo.module';
import { InlineFormDemoComponent as InlineFormCustomButtonsDemoComponent } from '../code-examples/inline-form/inline-form/custom-buttons/inline-form-demo.component';
import { InlineFormDemoModule as InlineFormCustomButtonsDemoModule } from '../code-examples/inline-form/inline-form/custom-buttons/inline-form-demo.module';
import { InlineFormDemoComponent as InlineFormRepeatersDemoComponent } from '../code-examples/inline-form/inline-form/repeaters/inline-form-demo.component';
import { InlineFormDemoModule as InlineFormRepeatersDemoModule } from '../code-examples/inline-form/inline-form/repeaters/inline-form-demo.module';

const routes: Routes = [
  {
    path: 'basic',
    component: InlineFormDemoComponent,
  },
  {
    path: 'custom-buttons',
    component: InlineFormCustomButtonsDemoComponent,
  },
  {
    path: 'repeaters',
    component: InlineFormRepeatersDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InlineFormFeatureRoutingModule {}

@NgModule({
  imports: [
    InlineFormFeatureRoutingModule,
    InlineFormDemoModule,
    InlineFormCustomButtonsDemoModule,
    InlineFormRepeatersDemoModule,
  ],
})
export class InlineFormFeatureModule {}
