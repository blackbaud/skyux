import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'autocomplete',
    loadChildren: () =>
      import('./autocomplete/autocomplete.module').then(
        (m) => m.AutocompleteModule,
      ),
  },
  {
    path: 'country-field',
    loadChildren: () =>
      import('./country-field/country-field.module').then(
        (m) => m.CountryFieldModule,
      ),
  },
  {
    path: 'lookup',
    loadChildren: () =>
      import('./lookup/lookup.module').then((m) => m.LookupModule),
  },
  {
    path: 'selection-modal',
    loadChildren: () =>
      import('./selection-modal/selection-modal.module').then(
        (m) => m.SelectionModalModule,
      ),
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
export class LookupModule {
  public static routes = routes;
}
