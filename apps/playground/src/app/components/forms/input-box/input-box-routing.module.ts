import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { InputBoxComponent } from './input-box.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: InputBoxComponent,
      },
    ]),
  ],
})
export class InputBoxRoutingModule {}
