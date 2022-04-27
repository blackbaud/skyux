import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SkipLinkComponent } from './skip-link/skip-link.component';

const routes: Routes = [
  {
    path: 'skip-link',
    loadChildren: () =>
      import('./skip-link/skip-link.module').then((m) => m.SkipLinkModule),
  },
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})
export class A11yRoutingModule {}

@NgModule({
  imports: [A11yRoutingModule],
})
export class A11yModule {}
