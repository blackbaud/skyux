import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AvatarComponent } from './avatar.component';

const routes: Routes = [
  {
    path: '',
    component: AvatarComponent,
    data: {
      name: 'Avatar',
      icon: 'person',
      library: 'avatar',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvatarRoutingModule {
  public static routes = routes;
}
