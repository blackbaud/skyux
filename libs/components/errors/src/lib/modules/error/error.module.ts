import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyModalModule } from '@skyux/modals';

import { SkyErrorsResourcesModule } from '../shared/sky-errors-resources.module';

import { SkyErrorActionComponent } from './error-action.component';
import { SkyErrorDescriptionComponent } from './error-description.component';
import { SkyErrorImageComponent } from './error-image.component';
import { SkyErrorModalFormComponent } from './error-modal-form.component';
import { SkyErrorTitleComponent } from './error-title.component';
import { SkyErrorComponent } from './error.component';

@NgModule({
  declarations: [
    SkyErrorComponent,
    SkyErrorImageComponent,
    SkyErrorTitleComponent,
    SkyErrorDescriptionComponent,
    SkyErrorActionComponent,
    SkyErrorModalFormComponent,
  ],
  imports: [CommonModule, SkyErrorsResourcesModule, SkyModalModule],
  exports: [
    SkyErrorComponent,
    SkyErrorImageComponent,
    SkyErrorTitleComponent,
    SkyErrorDescriptionComponent,
    SkyErrorActionComponent,
  ],
  entryComponents: [SkyErrorModalFormComponent],
})
export class SkyErrorModule {}
