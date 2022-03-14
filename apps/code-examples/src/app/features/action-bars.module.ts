import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SummaryActionBarDemoComponent as BasicComponent } from '../code-examples/action-bars/summary-action-bar/basic/summary-action-bar-demo.component';
import { SummaryActionBarDemoModule as BasicModule } from '../code-examples/action-bars/summary-action-bar/basic/summary-action-bar-demo.module';
import { SummaryActionBarDemoComponent as ModalComponent } from '../code-examples/action-bars/summary-action-bar/modal/summary-action-bar-demo.component';
import { SummaryActionBarDemoModule as ModalModule } from '../code-examples/action-bars/summary-action-bar/modal/summary-action-bar-demo.module';
import { SummaryActionBarDemoComponent as TabComponent } from '../code-examples/action-bars/summary-action-bar/tab/summary-action-bar-demo.component';
import { SummaryActionBarDemoModule as TabModule } from '../code-examples/action-bars/summary-action-bar/tab/summary-action-bar-demo.module';

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
  imports: [BasicModule, ModalModule, TabModule, ActionBarsRoutingModule],
})
export class ActionBarsModule {}
