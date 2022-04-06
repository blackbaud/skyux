import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfirmDemoComponent as ConfirmConfirmDemoComponent } from '../code-examples/modals/confirm/confirm-demo.component';
import { ConfirmDemoModule as ConfirmConfirmDemoModule } from '../code-examples/modals/confirm/confirm-demo.module';
import { ModalDemoComponent as ModalModalDemoComponent } from '../code-examples/modals/modal/modal-demo.component';
import { ModalDemoModule as ModalModalDemoModule } from '../code-examples/modals/modal/modal-demo.module';

const routes: Routes = [
  { path: 'confirm', component: ConfirmConfirmDemoComponent },
  { path: 'modal', component: ModalModalDemoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalsFeatureRoutingModule {}

@NgModule({
  imports: [
    ConfirmConfirmDemoModule,
    ModalModalDemoModule,
    ModalsFeatureRoutingModule,
  ],
})
export class ModalsFeatureModule {}
