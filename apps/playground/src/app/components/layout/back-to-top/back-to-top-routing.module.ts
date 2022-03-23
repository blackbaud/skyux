import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BackToTopComponent } from './basic/back-to-top.component';
import { BackToTopMessageStreamComponent } from './message-stream/back-to-top-message-stream.component';
import { BackToTopScrollableParentComponent } from './scrollable-parent/back-to-top-scrollable-parent.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: BackToTopComponent,
      },
      {
        path: 'message-stream',
        component: BackToTopMessageStreamComponent,
      },
      {
        path: 'scrollable-parent',
        component: BackToTopScrollableParentComponent,
      },
    ]),
  ],
})
export class BackToTopRoutingModule {}
