import {
  NgModule
} from '@angular/core';

import {
  StachePageHeaderComponent
} from './page-header.component';

import {
  StachePageTitleComponent
} from './page-title.component';

@NgModule({
  declarations: [
    StachePageHeaderComponent,
    StachePageTitleComponent
  ],
  exports: [
    StachePageHeaderComponent,
    StachePageTitleComponent
  ]
})
export class StachePageHeaderModule { }
