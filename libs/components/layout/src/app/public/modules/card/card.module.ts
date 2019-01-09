import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

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
  SkyLayoutResourcesModule
} from '../shared';

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
    SkyLayoutResourcesModule
  ],
  exports: [
    SkyCardActionsComponent,
    SkyCardComponent,
    SkyCardContentComponent,
    SkyCardTitleComponent
  ]
})
export class SkyCardModule { }
