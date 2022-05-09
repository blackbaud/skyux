import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'sectioned-form',
    loadChildren: () =>
      import('./sectioned-form/sectioned-form.module').then(
        (m) => m.SectionedFormModule
      ),
  },
  {
    path: 'vertical-tabset',
    loadChildren: () =>
      import('./vertical-tabset/vertical-tabset.module').then(
        (m) => m.VerticalTabsetModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsRoutingModule {}

@NgModule({
  imports: [TabsRoutingModule],
})
export class TabsModule {}
