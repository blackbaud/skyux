import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DemoComponent as BasicComponent } from '../code-examples/action-bars/summary-action-bar/basic/demo.component';
import { DemoComponent as ModalComponent } from '../code-examples/action-bars/summary-action-bar/modal/demo.component';
import { DemoComponent as TabComponent } from '../code-examples/action-bars/summary-action-bar/tab/demo.component';

const routes: Routes = [
  {
    path: 'basic',
    component: BasicComponent,
  },
  {
    path: 'modal',
    component: ModalComponent,
  },
  {
    path: 'tab',
    component: TabComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionBarsRoutingModule {}

@NgModule({
  imports: [
    BasicComponent,
    ModalComponent,
    TabComponent,
    ActionBarsRoutingModule,
  ],
})
export class ActionBarsModule {}
