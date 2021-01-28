import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyThemeService
} from '@skyux/theme';

import {
  SkyDescriptionListTestComponent
} from './description-list.component.fixture';

import {
  SkyDescriptionListModule
} from '../description-list.module';

@NgModule({
  declarations: [
    SkyDescriptionListTestComponent
  ],
  imports: [
    CommonModule,
    SkyDescriptionListModule
  ],
  exports: [
    SkyDescriptionListTestComponent
  ],
  providers: [
    SkyThemeService
  ]
})
export class SkyDescriptionListFixturesModule { }
