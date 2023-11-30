import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'modal-viewkeeper',
    loadChildren: () =>
      import('./modal-viewkept-toolbars/modal-viewkept-toolbars.module').then(
        (m) => m.ModalViewkeptToolbarsModule
      ),
  },
  {
    path: 'modal-wait',
    loadChildren: () =>
      import('./modal-wait/modal-wait.module').then((m) => m.ModalWaitModule),
  },
  {
    path: 'viewkeeper-tabset',
    loadChildren: () =>
      import('./viewkeeper-tabset/viewkeeper-tabset.module').then(
        (m) => m.ViewkeeperTabsetModule
      ),
  },
  {
    path: 'vertical-tabset-back-to-top',
    loadChildren: () =>
      import(
        './vertical-tabset-back-to-top/vertical-tabset-back-to-top.module'
      ).then((m) => m.VerticalTabsetBackToTopModule),
  },
  {
    path: 'toast',
    loadChildren: () =>
      import('./toast/toast.module').then((m) => m.ToastModule),
  },
  {
    path: 'toolbar-standard-items',
    loadChildren: () =>
      import('./toolbar-standard-items/toolbar-standard-items.module').then(
        (m) => m.ToolbarStandardItemsModule
      ),
  },
  {
    path: 'field-heights',
    loadChildren: () =>
      import('./field-heights/field-heights.module').then(
        (m) => m.FieldHeightsModule
      ),
  },
  {
    path: 'lookup-in-modal',
    loadChildren: () =>
      import('./lookup-in-modal/lookup-in-modal.module').then(
        (m) => m.LookupInModalModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntegrationsRoutingModule {}

@NgModule({
  imports: [IntegrationsRoutingModule],
})
export class IntegrationsModule {
  public static routes = routes;
}
