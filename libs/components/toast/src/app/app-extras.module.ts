import {
  NgModule
} from '@angular/core';

import {
  SkyToastModule,
  SkyToastService
} from './public';
import {
  ToastDemoComponent
} from './visual/toast/toast-demo.component';

@NgModule({
  imports: [
    SkyToastModule
  ],
  exports: [
    SkyToastModule
  ],
  providers: [
    SkyToastService
  ],
  entryComponents: [
    ToastDemoComponent
  ]
})
export class AppExtrasModule { }
