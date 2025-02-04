import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyTrimModule } from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import { SkyProgressIndicatorResourcesModule } from '../shared/sky-progress-indicator-resources.module';

import { SkyProgressIndicatorItemComponent } from './progress-indicator-item/progress-indicator-item.component';
import { SkyProgressIndicatorNavButtonClass } from './progress-indicator-nav-button/progress-indicator-nav-button-class.pipe';
import { SkyProgressIndicatorNavButtonDisabledPipe } from './progress-indicator-nav-button/progress-indicator-nav-button-disabled.pipe';
import { SkyProgressIndicatorNavButtonComponent } from './progress-indicator-nav-button/progress-indicator-nav-button.component';
import { SkyProgressIndicatorResetButtonComponent } from './progress-indicator-reset-button/progress-indicator-reset-button.component';
import { SkyProgressIndicatorMarkerClassPipe } from './progress-indicator-status-marker/progress-indicator-status-marker-class.pipe';
import { SkyProgressIndicatorStatusMarkerComponent } from './progress-indicator-status-marker/progress-indicator-status-marker.component';
import { SkyProgressIndicatorTitleComponent } from './progress-indicator-title/progress-indicator-title.component';
import { SkyProgressIndicatorComponent } from './progress-indicator.component';

@NgModule({
  declarations: [
    SkyProgressIndicatorComponent,
    SkyProgressIndicatorItemComponent,
    SkyProgressIndicatorMarkerClassPipe,
    SkyProgressIndicatorNavButtonClass,
    SkyProgressIndicatorNavButtonDisabledPipe,
    SkyProgressIndicatorNavButtonComponent,
    SkyProgressIndicatorResetButtonComponent,
    SkyProgressIndicatorStatusMarkerComponent,
    SkyProgressIndicatorTitleComponent,
  ],
  imports: [
    CommonModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyProgressIndicatorResourcesModule,
    SkyThemeModule,
    SkyTrimModule,
  ],
  exports: [
    SkyProgressIndicatorComponent,
    SkyProgressIndicatorItemComponent,
    SkyProgressIndicatorNavButtonComponent,
    SkyProgressIndicatorResetButtonComponent,
    SkyProgressIndicatorTitleComponent,
  ],
})
export class SkyProgressIndicatorModule {}
