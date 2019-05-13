import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyProgressIndicatorResourcesModule
} from '../shared/progress-indicator-resources.module';

import {
  SkyProgressIndicatorComponent
} from './progress-indicator.component';

import {
  SkyProgressIndicatorItemComponent
} from './progress-indicator-item/progress-indicator-item.component';

import {
  SkyProgressIndicatorNavButtonComponent
} from './progress-indicator-nav-button/progress-indicator-nav-button.component';

import {
  SkyProgressIndicatorResetButtonComponent
} from './progress-indicator-reset-button/progress-indicator-reset-button.component';

import {
  SkyProgressIndicatorStatusMarkerComponent
} from './progress-indicator-status-marker/progress-indicator-status-marker.component';

import {
  SkyProgressIndicatorTitleComponent
} from './progress-indicator-title/progress-indicator-title.component';

@NgModule({
  declarations: [
    SkyProgressIndicatorComponent,
    SkyProgressIndicatorItemComponent,
    SkyProgressIndicatorNavButtonComponent,
    SkyProgressIndicatorResetButtonComponent,
    SkyProgressIndicatorStatusMarkerComponent,
    SkyProgressIndicatorTitleComponent
  ],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyIconModule,
    SkyProgressIndicatorResourcesModule
  ],
  exports: [
    SkyProgressIndicatorComponent,
    SkyProgressIndicatorItemComponent,
    SkyProgressIndicatorNavButtonComponent,
    SkyProgressIndicatorResetButtonComponent,
    SkyProgressIndicatorStatusMarkerComponent,
    SkyProgressIndicatorTitleComponent
  ],
  providers: [
    SkyAppWindowRef
  ]
})
export class SkyProgressIndicatorModule { }
