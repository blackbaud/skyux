import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'autocomplete/advanced',
    loadComponent: () =>
      import(
        '../code-examples/lookup/autocomplete/advanced/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'autocomplete/basic',
    loadComponent: () =>
      import('../code-examples/lookup/autocomplete/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'autocomplete/custom-search',
    loadComponent: () =>
      import(
        '../code-examples/lookup/autocomplete/custom-search/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'autocomplete/search-filters',
    loadComponent: () =>
      import(
        '../code-examples/lookup/autocomplete/search-filters/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'country-field/basic',
    loadComponent: () =>
      import('../code-examples/lookup/country-field/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'lookup/add-item',
    loadComponent: () =>
      import('../code-examples/lookup/lookup/add-item/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'lookup/custom-picker',
    loadComponent: () =>
      import(
        '../code-examples/lookup/lookup/custom-picker/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'lookup/multi-select',
    loadComponent: () =>
      import('../code-examples/lookup/lookup/multi-select/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'lookup/result-templates',
    loadComponent: () =>
      import(
        '../code-examples/lookup/lookup/result-templates/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'lookup/single-select',
    loadComponent: () =>
      import(
        '../code-examples/lookup/lookup/single-select/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'search/basic',
    loadComponent: () =>
      import('../code-examples/lookup/search/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'selection-modal/add-item',
    loadComponent: () =>
      import(
        '../code-examples/lookup/selection-modal/add-item/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'selection-modal/basic',
    loadComponent: () =>
      import(
        '../code-examples/lookup/selection-modal/basic/demo.component'
      ).then((c) => c.DemoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class LookupModule {}
