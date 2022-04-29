import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'a11y',
    loadChildren: () => import('./a11y/a11y.module').then((m) => m.A11yModule),
  },
  {
    path: 'action-bars',
    loadChildren: () =>
      import('./action-bars/action-bars.module').then(
        (m) => m.ActionBarsModule
      ),
  },
  {
    path: 'core',
    loadChildren: () => import('./core/core.module').then((m) => m.CoreModule),
  },
  {
    path: 'ag-grid',
    loadChildren: () =>
      import('./ag-grid/ag-grid.module').then((m) => m.AgGridModule),
  },
  {
    path: 'datetime',
    loadChildren: () =>
      import('./datetime/datetime.module').then((m) => m.DatetimeModule),
  },
  {
    path: 'flyout',
    loadChildren: () =>
      import('./flyout/flyout.module').then((m) => m.FlyoutModule),
  },
  {
    path: 'forms',
    loadChildren: () =>
      import('./forms/forms.module').then((m) => m.FormsModule),
  },
  {
    path: 'layout',
    loadChildren: () =>
      import('./layout/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: 'lookup',
    loadChildren: () =>
      import('./lookup/lookup.module').then((m) => m.LookupModule),
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./pages/pages.module').then((m) => m.PagesModule),
  },
  {
    path: 'phone-field',
    loadChildren: () =>
      import('./phone-field/phone-field.module').then(
        (m) => m.PhoneFieldModule
      ),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsModule),
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
