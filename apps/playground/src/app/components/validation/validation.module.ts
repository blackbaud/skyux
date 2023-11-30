import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'url-validation',
    loadChildren: () =>
      import('./url-validation/url-validation.module').then(
        (m) => m.UrlValidationModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidationRoutingModule {}

@NgModule({
  imports: [ValidationRoutingModule],
})
export class ValidationModule {
  public static routes = routes;
}
