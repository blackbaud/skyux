import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyThemeModule
} from '@skyux/theme';

import { SkyLayoutResourcesModule } from '../shared/sky-layout-resources.module';

import {
  SkyDescriptionListComponent
} from './description-list.component';

import {
  SkyDescriptionListContentComponent
} from './description-list-content.component';

import {
  SkyDescriptionListTermComponent
} from './description-list-term.component';

import {
  SkyDescriptionListDescriptionComponent
} from './description-list-description.component';

@NgModule({
  declarations: [
    SkyDescriptionListComponent,
    SkyDescriptionListContentComponent,
    SkyDescriptionListTermComponent,
    SkyDescriptionListDescriptionComponent
  ],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyLayoutResourcesModule,
    SkyThemeModule
  ],
  exports: [
    SkyDescriptionListComponent,
    SkyDescriptionListContentComponent,
    SkyDescriptionListTermComponent,
    SkyDescriptionListDescriptionComponent
  ]
})
export class SkyDescriptionListModule { }
