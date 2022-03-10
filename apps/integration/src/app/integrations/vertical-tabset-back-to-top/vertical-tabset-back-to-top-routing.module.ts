import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { VerticalTabsetBackToTopComponent } from './vertical-tabset-back-to-top.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: VerticalTabsetBackToTopComponent,
      },
    ]),
  ],
})
export class VerticalTabsetBackToTopRoutingModule {}
