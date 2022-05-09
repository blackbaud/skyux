import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SectionedFormComponent } from './sectioned-form.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SectionedFormComponent,
      },
    ]),
  ],
})
export class SectionedFormRoutingModule {}
