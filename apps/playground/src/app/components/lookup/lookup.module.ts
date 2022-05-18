import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'autocomplete',
    loadChildren: () =>
      import('./autocomplete/autocomplete.module').then(
        (m) => m.AutocompleteModule
      ),
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
export class LookupRoutingModule {}

@NgModule({
  imports: [LookupRoutingModule],
})
export class LookupModule {}
