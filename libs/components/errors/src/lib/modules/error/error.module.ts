import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyErrorsResourcesModule } from '../shared/sky-errors-resources.module';

import { SkyErrorActionComponent } from './error-action.component';
import { SkyErrorDescriptionComponent } from './error-description.component';
import { SkyErrorImageComponent } from './error-image.component';
import { SkyErrorTitleComponent } from './error-title.component';
import { SkyErrorComponent } from './error.component';

@NgModule({
  declarations: [
    SkyErrorComponent,
    SkyErrorImageComponent,
    SkyErrorTitleComponent,
    SkyErrorDescriptionComponent,
    SkyErrorActionComponent,
  ],
  imports: [CommonModule, SkyErrorsResourcesModule],
  exports: [
    SkyErrorComponent,
    SkyErrorImageComponent,
    SkyErrorTitleComponent,
    SkyErrorDescriptionComponent,
    SkyErrorActionComponent,
  ],
})
export class SkyErrorModule {}
