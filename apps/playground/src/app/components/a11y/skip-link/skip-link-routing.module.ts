import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SkipLinkComponent } from './skip-link.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SkipLinkComponent,
      },
    ]),
  ],
})
export class SkipLinkRoutingModule {}
