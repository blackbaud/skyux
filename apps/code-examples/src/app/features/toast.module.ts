import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ToastDemoComponent as ToastBasicDemoComponent } from '../code-examples/toast/toast/basic/toast-demo.component';
import { ToastDemoModule as ToastDemoBasicModule } from '../code-examples/toast/toast/basic/toast-demo.module';
import { ToastDemoComponent as ToastDemoCustomComponent } from '../code-examples/toast/toast/custom-component/toast-demo.component';
import { ToastDemoModule as ToastDemoCustomModule } from '../code-examples/toast/toast/custom-component/toast-demo.module';

const routes: Routes = [
  {
    path: 'basic',
    component: ToastBasicDemoComponent,
  },
  {
    path: 'custom-component',
    component: ToastDemoCustomComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToastFeatureRoutingModule {}

@NgModule({
  imports: [
    ToastDemoBasicModule,
    ToastDemoCustomModule,
    ToastFeatureRoutingModule,
  ],
})
export class ToastFeatureModule {}
