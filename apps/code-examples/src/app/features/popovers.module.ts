import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PopoverDemoComponent as PopoverBasicDemoComponent } from '../code-examples/popovers/popover/basic/popover-demo.component';
import { PopoverDemoModule as PopoverBasicDemoModule } from '../code-examples/popovers/popover/basic/popover-demo.module';
import { PopoverDemoComponent as PopoverProgrammaticDemoComponent } from '../code-examples/popovers/popover/programmatic/popover-demo.component';
import { PopoverDemoModule as PopoverProgrammaticDemoModule } from '../code-examples/popovers/popover/programmatic/popover-demo.module';

const routes: Routes = [
  {
    path: 'popover/basic',
    component: PopoverBasicDemoComponent,
  },
  {
    path: 'popover/programmatic',
    component: PopoverProgrammaticDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoversRoutingModule {}

@NgModule({
  imports: [
    PopoversRoutingModule,
    PopoverBasicDemoModule,
    PopoverProgrammaticDemoModule,
  ],
})
export class PopoversFeatureModule {}
