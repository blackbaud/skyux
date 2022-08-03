import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CheckboxDemoComponent as CheckboxBasicDemoComponent } from '../code-examples/forms/checkbox/basic/checkbox-demo.component';
import { CheckboxDemoModule as CheckboxBasicDemoModule } from '../code-examples/forms/checkbox/basic/checkbox-demo.module';
import { CheckboxDemoComponent as InlineHelpCheckboxDemoComponent } from '../code-examples/forms/checkbox/inline-help/checkbox-demo.component';
import { CheckboxDemoModule as InlineHelpCheckboxDemoModule } from '../code-examples/forms/checkbox/inline-help/checkbox-demo.module';
import { RadioDemoComponent as InlineHelpRadioDemoComponent } from '../code-examples/forms/radio/inline-help/radio-demo.component';
import { RadioDemoModule as InlineHelpRadioDemoModule } from '../code-examples/forms/radio/inline-help/radio-demo.module';
import { ToggleSwitchDemoComponent as InlineHelpToggleSwitchComponent } from '../code-examples/forms/toggle-switch/inline-help/toggle-switch-demo.component';
import { SkyToggleSwitchDemoModule as InlineHelpToggleSwitchModule } from '../code-examples/forms/toggle-switch/inline-help/toggle-switch-demo.module';

const routes: Routes = [
  {
    path: 'checkbox/basic',
    component: CheckboxBasicDemoComponent,
  },
  {
    path: 'radio/inline-help',
    component: InlineHelpRadioDemoComponent,
  },
  {
    path: 'checkbox/inline-help',
    component: InlineHelpCheckboxDemoComponent,
  },
  {
    path: 'toggle-switch/inline-help',
    component: InlineHelpToggleSwitchComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormsRoutingModule {}

@NgModule({
  imports: [
    CheckboxBasicDemoModule,
    FormsRoutingModule,
    InlineHelpCheckboxDemoModule,
    InlineHelpRadioDemoModule,
    InlineHelpToggleSwitchModule,
  ],
})
export class FormsModule {}
