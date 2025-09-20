import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ToastComponent } from './toast.component';

const routes: Routes = [
  {
    path: '',
    component: ToastComponent,
    data: {
      name: 'Toast',
      icon: 'megaphone',
    },
  },
];

@NgModule({
  declarations: [ToastComponent],
  imports: [RouterModule.forChild(routes)],
})
export class ToastModule {
  public static routes = routes;
}
