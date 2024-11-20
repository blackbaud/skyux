import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
  },
  {
    path: 'action-bars',
    loadChildren: () =>
      import('./features/action-bars.module').then((m) => m.ActionBarsModule),
  },
  {
    path: 'angular-tree',
    loadChildren: () =>
      import('./features/angular-tree.module').then(
        (m) => m.AngularTreeFeatureModule,
      ),
  },
  {
    path: 'autonumeric',
    loadChildren: () =>
      import('./features/autonumeric.module').then(
        (m) => m.AutonumericFeatureModule,
      ),
  },
  {
    path: 'avatar',
    loadChildren: () =>
      import('./features/avatar.module').then((m) => m.AvatarFeatureModule),
  },
  {
    path: 'colorpicker',
    loadChildren: () =>
      import('./features/colorpicker.module').then(
        (m) => m.ColorpickerFeatureModule,
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
    path: 'flyout',
    loadChildren: () =>
      import('./features/flyout.module').then((m) => m.FlyoutFeatureModule),
  },
  {
    path: 'forms',
    loadChildren: () =>
      import('./features/forms.module').then((m) => m.FormsModule),
  },
  {
    path: 'help-inline',
    loadChildren: () =>
      import('./features/help-inline.module').then(
        (m) => m.HelpInlineFeatureModule,
      ),
  },
  {
    path: 'icon',
    loadChildren: () =>
      import('./features/icon.module').then((m) => m.IconFeatureModule),
  },
  {
    path: 'indicators',
    loadChildren: () =>
      import('./features/indicators.module').then(
        (m) => m.IndicatorsFeatureModule,
      ),
  },
  {
    path: 'inline-form',
    loadChildren: () =>
      import('./features/inline-form.module').then(
        (m) => m.InlineFormFeatureModule,
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
    path: 'navbar',
    loadChildren: () =>
      import('./features/navbar.module').then((m) => m.NavbarFeatureModule),
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
        (m) => m.ProgressIndicatorFeatureModule,
      ),
  },
  {
    path: 'split-view',
    loadChildren: () =>
      import('./features/split-view.module').then((m) => m.SplitViewModule),
  },
  {
    path: 'themes',
    loadChildren: () =>
      import('./features/themes.module').then((m) => m.ThemesFeatureModule),
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
    path: 'pages',
    loadChildren: () =>
      import('./features/pages.module').then((m) => m.PagesFeatureModule),
  },
  {
    path: 'data-manager',
    loadChildren: () =>
      import('./features/data-manager.module').then(
        (m) => m.DataManagerFeatureModule,
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
        (m) => m.TextEditorFeatureModule,
      ),
  },
  {
    path: 'router',
    loadChildren: () =>
      import('./features/router.module').then((m) => m.RouterFeatureModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
