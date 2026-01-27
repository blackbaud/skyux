import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'autonumeric',
    loadChildren: () =>
      import('./presets/autonumeric-presets.module').then(
        (m) => m.AutonumericPresetsModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutonumericRoutingModule {}

@NgModule({
  imports: [AutonumericRoutingModule],
})
export class AutonumericModule {
  public static routes = routes;
}
