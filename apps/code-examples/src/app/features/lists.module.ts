import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RepeaterDemoComponent as RepeaterAddRemoveDemoComponent } from '../code-examples/lists/repeater/add-remove/repeater-demo.component';
import { RepeaterDemoModule as RepeaterAddRemoveDemoModule } from '../code-examples/lists/repeater/add-remove/repeater-demo.module';
import { RepeaterDemoComponent as RepeaterBasicDemoComponent } from '../code-examples/lists/repeater/basic/repeater-demo.component';
import { RepeaterDemoModule as RepeaterBasicDemoModule } from '../code-examples/lists/repeater/basic/repeater-demo.module';

const routes: Routes = [
  {
    path: 'repeater/basic',
    component: RepeaterBasicDemoComponent,
  },
  {
    path: 'repeater/add-remove',
    component: RepeaterAddRemoveDemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListsFeatureRoutingModule {}

@NgModule({
  imports: [
    ListsFeatureRoutingModule,
    RepeaterAddRemoveDemoModule,
    RepeaterBasicDemoModule,
  ],
})
export class ListsFeatureModule {}
