import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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
export class LookupRoutingModule {}

@NgModule({
  imports: [LookupRoutingModule],
})
export class LookupModule {}
