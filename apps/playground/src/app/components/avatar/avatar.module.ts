import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'avatar',
    loadChildren: () =>
      import('./avatar/avatar.module').then((m) => m.AvatarModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvatarRoutingModule {
  public static routes = routes;
}

@NgModule({
  imports: [AvatarRoutingModule],
})
export class AvatarModule {
  public static routes = AvatarRoutingModule.routes;
}
