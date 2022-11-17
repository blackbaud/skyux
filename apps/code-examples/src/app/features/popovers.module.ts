import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DropdownDemoComponent as DropdownBasicDemoComponent } from '../code-examples/popovers/dropdown/basic/dropdown-demo.component';
import { DropdownDemoModule as DropdownBasicDemoModule } from '../code-examples/popovers/dropdown/basic/dropdown-demo.module';
import { PopoverDemoComponent as PopoverBasicDemoComponent } from '../code-examples/popovers/popover/basic/popover-demo.component';
import { PopoverDemoModule as PopoverBasicDemoModule } from '../code-examples/popovers/popover/basic/popover-demo.module';
import { PopoverDemoComponent as PopoverProgrammaticDemoComponent } from '../code-examples/popovers/popover/programmatic/popover-demo.component';
import { PopoverDemoModule as PopoverProgrammaticDemoModule } from '../code-examples/popovers/popover/programmatic/popover-demo.module';

const routes: Routes = [
  {
    path: 'dropdown/basic',
    component: DropdownBasicDemoComponent,
  },
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
    DropdownBasicDemoModule,
    PopoversRoutingModule,
    PopoverBasicDemoModule,
    PopoverProgrammaticDemoModule,
  ],
})
export class PopoversFeatureModule {}
