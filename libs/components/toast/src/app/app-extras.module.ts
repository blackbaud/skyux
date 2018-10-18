import {
  NgModule
} from '@angular/core';
import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyToastModule,
  SkyToastService
} from './public';
import {
  ToastDemoComponent
} from './visual/toast/toast-demo.component';

@NgModule({
  imports: [
    SkyToastModule,
    NoopAnimationsModule
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
