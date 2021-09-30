import {
  NgModule
} from '@angular/core';

import {
  SkyAvatarModule
} from 'projects/avatar/src/public-api';

import {
  AvatarDemoComponent
} from './avatar-demo.component';

@NgModule({
  declarations: [
    AvatarDemoComponent
  ],
  imports: [
    SkyAvatarModule
  ],
  exports: [
    AvatarDemoComponent
  ]
})
export class AvatarDemoModule { }
