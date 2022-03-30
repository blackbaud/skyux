import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FlyoutComponent } from './flyout.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: FlyoutComponent,
      },
    ]),
  ],
})
export class FlyoutRoutingModule {}
