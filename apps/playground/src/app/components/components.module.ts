import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'datetime',
    loadChildren: () =>
      import('./datetime/datetime.module').then((m) => m.DatetimeModule),
  },
  {
    path: 'lookup',
    loadChildren: () =>
      import('./lookup/lookup.module').then((m) => m.LookupModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsRoutingModule {}

@NgModule({
  imports: [ComponentsRoutingModule],
})
export class ComponentsModule {}
