import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { SkyIconModule } from '@skyux/indicators';

import { SkyI18nModule } from '@skyux/i18n';

import { SkyHrefModule } from '@skyux/router';

import { SkyThemeModule } from '@skyux/theme';

import { SkyFlyoutResourcesModule } from '../shared/sky-flyout-resources.module';

import { SkyFlyoutComponent } from './flyout.component';

import { SkyFlyoutIteratorComponent } from './flyout-iterator.component';

@NgModule({
  declarations: [SkyFlyoutComponent, SkyFlyoutIteratorComponent],
  imports: [
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
  entryComponents: [SkyFlyoutComponent],
})
export class SkyFlyoutModule {}
