import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyInlineDeleteModule
} from '../inline-delete/inline-delete.module';
import { SkyLayoutResourcesModule } from '../shared/sky-layout-resources.module';

import {
  SkyCardActionsComponent
} from './card-actions.component';

import {
  SkyCardContentComponent
} from './card-content.component';

import {
  SkyCardTitleComponent
} from './card-title.component';

import {
  SkyCardComponent
} from './card.component';

@NgModule({
  declarations: [
    SkyCardActionsComponent,
    SkyCardComponent,
    SkyCardContentComponent,
    SkyCardTitleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule,
    SkyI18nModule,
    SkyLayoutResourcesModule,
    SkyInlineDeleteModule
  ],
  exports: [
    SkyCardActionsComponent,
    SkyCardComponent,
    SkyCardContentComponent,
    SkyCardTitleComponent
  ]
})
export class SkyCardModule { }
