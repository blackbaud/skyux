import {
  NgModule
} from '@angular/core';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SampleDemoComponent
} from './sample-demo.component';

import {
  SampleModalDemoComponent
} from './sample-modal-demo.component';

@NgModule({
  declarations: [
    SampleDemoComponent,
    SampleModalDemoComponent
  ],
  imports: [
    SkyModalModule
  ],
  exports: [
    SampleDemoComponent
  ],
  entryComponents: [
    SampleModalDemoComponent
  ]
})
export class SampleDemoModule { }
