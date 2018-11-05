import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyProgressIndicatorResourcesModule
} from '../shared';

import {
  SkyProgressIndicatorItemComponent
} from './progress-indicator-item';
import {
  SkyProgressIndicatorComponent
} from './progress-indicator.component';
import {
  SkyProgressIndicatorNavButtonComponent
} from './progress-indicator-nav-button';
import {
  SkyProgressIndicatorResetButtonComponent
} from './progress-indicator-reset-button';
import {
  SkyProgressIndicatorTitleComponent
} from './progress-indicator-title';

@NgModule({
  declarations: [
    SkyProgressIndicatorItemComponent,
    SkyProgressIndicatorComponent,
    SkyProgressIndicatorNavButtonComponent,
    SkyProgressIndicatorResetButtonComponent,
    SkyProgressIndicatorTitleComponent
  ],
  imports: [
    SkyI18nModule,
    CommonModule,
    SkyProgressIndicatorResourcesModule
  ],
  exports: [
    SkyProgressIndicatorItemComponent,
    SkyProgressIndicatorComponent,
    SkyProgressIndicatorNavButtonComponent,
    SkyProgressIndicatorResetButtonComponent,
    SkyProgressIndicatorTitleComponent
  ]
})
export class SkyProgressIndicatorModule { }
