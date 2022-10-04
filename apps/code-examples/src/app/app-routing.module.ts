import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'action-bars',
    loadChildren: () =>
      import('./features/action-bars.module').then((m) => m.ActionBarsModule),
  },
  {
    path: 'colorpicker',
    loadChildren: () =>
      import('./features/colorpicker.module').then(
        (m) => m.ColorpickerFeatureModule
      ),
  },
  {
    path: 'core',
    loadChildren: () =>
      import('./features/core.module').then((m) => m.CoreFeatureModule),
  },
  {
    path: 'errors',
    loadChildren: () =>
      import('./features/errors.module').then((m) => m.ErrorsFeatureModule),
  },
  {
    path: 'forms',
    loadChildren: () =>
      import('./features/forms.module').then((m) => m.FormsModule),
  },
  {
    path: 'grids',
    loadChildren: () =>
      import('./features/grids.module').then((m) => m.GridsFeatureModule),
  },
  {
    path: 'indicators',
    loadChildren: () =>
      import('./features/indicators.module').then(
        (m) => m.IndicatorsFeatureModule
      ),
  },
  {
    path: 'layout',
    loadChildren: () =>
      import('./features/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: 'lists',
    loadChildren: () =>
      import('./features/lists.module').then((m) => m.ListsFeatureModule),
  },
  {
    path: 'lookup',
    loadChildren: () =>
      import('./features/lookup.module').then((m) => m.LookupModule),
  },
  {
    path: 'modals',
    loadChildren: () =>
      import('./features/modals.module').then((m) => m.ModalsFeatureModule),
  },
  {
    path: 'phone-field',
    loadChildren: () =>
      import('./features/phone-field.module').then((m) => m.PhoneModule),
  },
  {
    path: 'popovers',
    loadChildren: () =>
      import('./features/popovers.module').then((m) => m.PopoversFeatureModule),
  },
  {
    path: 'progress-indicator',
    loadChildren: () =>
      import('./features/progress-indicator.module').then(
        (m) => m.ProgressIndicatorFeatureModule
      ),
  },
  {
    path: 'datetime',
    loadChildren: () =>
      import('./features/datetime.module').then((m) => m.DatetimeFeatureModule),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./features/tabs.module').then((m) => m.TabsFeatureModule),
  },
  {
    path: 'ag-grid',
    loadChildren: () =>
      import('./features/ag-grid.module').then((m) => m.AgGridFeatureModule),
  },
  {
    path: 'tiles',
    loadChildren: () =>
      import('./features/tiles.module').then((m) => m.TilesFeatureModule),
  },
  {
    path: 'validation',
    loadChildren: () =>
      import('./features/validation.module').then((m) => m.ValidationModule),
  },
  {
    path: 'autonumeric',
    loadChildren: () =>
      import('./features/autonumeric.module').then(
        (m) => m.AutonumericFeatureModule
      ),
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./features/pages.module').then((m) => m.PagesFeatureModule),
  },
  {
    path: 'data-manager',
    loadChildren: () =>
      import('./features/data-manager.module').then(
        (m) => m.DataManagerFeatureModule
      ),
  },
  {
    path: 'toast',
    loadChildren: () =>
      import('./features/toast.module').then((m) => m.ToastFeatureModule),
  },
  {
    path: 'text-editor',
    loadChildren: () =>
      import('./features/text-editor.module').then(
        (m) => m.TextEditorFeatureModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
