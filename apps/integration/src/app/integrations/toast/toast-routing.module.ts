import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ToastComponent } from './toast.component';

const routes: Routes = [
  {
    path: '',
    component: ToastComponent,
    data: {
      name: 'Toast',
      icon: 'fire',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToastRoutingModule {
  public static routes = routes;
}
