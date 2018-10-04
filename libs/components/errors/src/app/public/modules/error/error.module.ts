import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  SkyModalModule
} from '@skyux/modals';

import {
  SkyErrorComponent
} from './error.component';
import {
  SkyErrorImageComponent
} from './error-image.component';
import {
  SkyErrorTitleComponent
} from './error-title.component';
import {
  SkyErrorDescriptionComponent
} from './error-description.component';
import {
  SkyErrorActionComponent
} from './error-action.component';

import {
  SkyErrorModalService
} from './error-modal.service';
import {
  SkyErrorModalFormComponent
} from './error-modal-form.component';

@NgModule({
  declarations: [
    SkyErrorComponent,
    SkyErrorImageComponent,
    SkyErrorTitleComponent,
    SkyErrorDescriptionComponent,
    SkyErrorActionComponent,
    SkyErrorModalFormComponent
  ],
  imports: [
    CommonModule,
    SkyModalModule
  ],
  exports: [
    SkyErrorComponent,
    SkyErrorImageComponent,
    SkyErrorTitleComponent,
    SkyErrorDescriptionComponent,
    SkyErrorActionComponent,
    SkyErrorModalFormComponent
  ],
  providers: [
    SkyErrorModalService
  ],
  entryComponents: [
    SkyErrorModalFormComponent
  ]
})
export class SkyErrorModule { }
