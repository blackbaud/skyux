import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ActionButtonComponent } from './basic/action-button.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ActionButtonComponent,
      },
    ]),
  ],
})
export class ActionButtonRoutingModule {}
