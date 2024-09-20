import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'data-entry-grid/basic',
    loadComponent: () =>
      import(
        '../code-examples/ag-grid/data-entry-grid/basic/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'data-entry-grid/data-manager-added',
    loadComponent: () =>
      import(
        '../code-examples/ag-grid/data-entry-grid/data-manager-added/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'data-entry-grid/focus',
    loadComponent: () =>
      import(
        '../code-examples/ag-grid/data-entry-grid/focus/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'data-entry-grid/inline-help',
    loadComponent: () =>
      import(
        '../code-examples/ag-grid/data-entry-grid/inline-help/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'data-grid/basic',
    loadComponent: () =>
      import('../code-examples/ag-grid/data-grid/basic/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'data-grid/basic-multiselect',
    loadComponent: () =>
      import(
        '../code-examples/ag-grid/data-grid/basic-multiselect/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'data-grid/data-manager',
    loadComponent: () =>
      import(
        '../code-examples/ag-grid/data-grid/data-manager/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'data-grid/data-manager-multiselect',
    loadComponent: () =>
      import(
        '../code-examples/ag-grid/data-grid/data-manager-multiselect/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'data-grid/inline-help',
    loadComponent: () =>
      import(
        '../code-examples/ag-grid/data-grid/inline-help/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'data-grid/paging',
    loadComponent: () =>
      import('../code-examples/ag-grid/data-grid/paging/demo.component').then(
        (c) => c.DemoComponent,
      ),
  },
  {
    path: 'data-grid/template-ref-column',
    loadComponent: () =>
      import(
        '../code-examples/ag-grid/data-grid/template-ref-column/demo.component'
      ).then((c) => c.DemoComponent),
  },
  {
    path: 'data-grid/top-scroll',
    loadComponent: () =>
      import(
        '../code-examples/ag-grid/data-grid/top-scroll/demo.component'
      ).then((c) => c.DemoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AgGridFeatureModule {}
