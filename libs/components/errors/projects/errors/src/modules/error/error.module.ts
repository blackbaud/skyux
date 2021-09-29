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
  SkyErrorsResourcesModule
} from '../shared/sky-errors-resources.module';

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
    SkyErrorsResourcesModule,
    SkyModalModule
  ],
  exports: [
    SkyErrorComponent,
    SkyErrorImageComponent,
    SkyErrorTitleComponent,
    SkyErrorDescriptionComponent,
    SkyErrorActionComponent
  ],
  entryComponents: [
    SkyErrorModalFormComponent
  ]
})
export class SkyErrorModule { }
