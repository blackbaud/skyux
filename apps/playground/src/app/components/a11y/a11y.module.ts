import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const a11yRoutes: Routes = [
  {
    path: 'skip-link',
    loadChildren: () =>
      import('./skip-link/skip-link.module').then((m) => m.SkipLinkModule),
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(a11yRoutes)],
})
export class A11yRoutingModule {
  public static routes = a11yRoutes;
}

@NgModule({
  imports: [A11yRoutingModule],
})
export class A11yModule {}
