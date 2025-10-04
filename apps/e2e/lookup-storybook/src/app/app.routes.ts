import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'search',
    loadChildren: () =>
      import('./search/search.module').then((m) => m.SearchModule),
  },
  {
    path: 'autocomplete',
    loadChildren: () =>
      import('./autocomplete/autocomplete.module').then(
        (m) => m.AutocompleteModule,
      ),
  },
  {
    path: 'lookup',
    loadChildren: () =>
      import('./lookup/lookup.module').then((m) => m.LookupModule),
  },
  {
    path: 'country-field',
    loadChildren: () =>
      import('./country-field/country-field.module').then(
        (m) => m.CountryFieldModule,
      ),
  },
];
