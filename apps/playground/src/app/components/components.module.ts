import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const componentRoutes: Routes = [
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
    path: 'ag-grid',
    loadChildren: () =>
      import('./ag-grid/ag-grid.module').then((m) => m.AgGridModule),
  },
  {
    path: 'angular-tree-component',
    loadChildren: () =>
      import('./angular-tree-component/angular-tree-component.module').then(
        (m) => m.AngularTreeComponentModule
      ),
  },
  {
    path: 'core',
    loadChildren: () => import('./core/core.module').then((m) => m.CoreModule),
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
    path: 'indicators',
    loadChildren: () =>
      import('./indicators/indicators.module').then((m) => m.IndicatorsModule),
  },
  {
    path: 'layout',
    loadChildren: () =>
      import('./layout/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: 'lists',
    loadChildren: () =>
      import('./lists/lists.module').then((m) => m.ListsFeatureModule),
  },
  {
    path: 'lookup',
    loadChildren: () =>
      import('./lookup/lookup.module').then((m) => m.LookupModule),
  },
  {
    path: 'modal',
    loadChildren: () =>
      import('./modal/modal-visual.module').then((m) => m.ModalVisualModule),
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
    path: 'popovers',
    loadChildren: () =>
      import('./popovers/popovers.module').then((m) => m.PopoversModule),
  },
  {
    path: 'split-view',
    loadChildren: () =>
      import('./split-view/split-view.module').then((m) => m.SplitViewModule),
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsModule),
  },
  {
    path: 'theme',
    loadChildren: () =>
      import('./theme/theme.module').then((m) => m.ThemeModule),
  },
  {
    path: 'toast',
    loadChildren: () =>
      import('./toast/toast.module').then((m) => m.ToastModule),
  },
  {
    path: 'validation',
    loadChildren: () =>
      import('./validation/validation.module').then((m) => m.ValidationModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(componentRoutes)],
  exports: [RouterModule],
})
export class ComponentsRoutingModule {}

@NgModule({
  imports: [ComponentsRoutingModule],
})
export class ComponentsModule {
  public static routes = componentRoutes;
}
