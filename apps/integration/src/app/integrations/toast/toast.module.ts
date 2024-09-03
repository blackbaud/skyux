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
  declarations: [ToastComponent],
  imports: [RouterModule.forChild(routes)],
})
export class ToastModule {
  public static routes = routes;
}
