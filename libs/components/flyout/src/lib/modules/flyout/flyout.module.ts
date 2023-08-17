import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/indicators';
import { SkyHrefModule } from '@skyux/router';
import { SkyThemeModule } from '@skyux/theme';

import { SkyFlyoutResourcesModule } from '../shared/sky-flyout-resources.module';

import { SkyFlyoutIteratorComponent } from './flyout-iterator.component';
import { SkyFlyoutComponent } from './flyout.component';
import { SkyFlyoutService } from './flyout.service';

@NgModule({
  declarations: [SkyFlyoutComponent, SkyFlyoutIteratorComponent],
  imports: [
    A11yModule,
    CommonModule,
    FormsModule,
    RouterModule,
    SkyI18nModule,
    SkyIconModule,
    SkyFlyoutResourcesModule,
    SkyThemeModule,
    SkyHrefModule,
  ],
  exports: [SkyFlyoutComponent],
  providers: [SkyFlyoutService],
})
export class SkyFlyoutModule {}
