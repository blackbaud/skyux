import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonsComponent } from './buttons.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ButtonsComponent,
      },
    ]),
  ],
})
export class ButtonsRoutingModule {}
