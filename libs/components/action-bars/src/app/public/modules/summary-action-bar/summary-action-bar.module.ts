import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import {
  SkyMediaQueryModule
} from '@skyux/core';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyIconModule,
  SkyChevronModule
} from '@skyux/indicators';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyActionBarsResourcesModule
} from '../shared';

import {
  SkySummaryActionBarComponent
} from './summary-action-bar.component';

import {
  SkySummaryActionBarActionsComponent,
  SkySummaryActionBarCancelComponent,
  SkySummaryActionBarPrimaryActionComponent,
  SkySummaryActionBarSecondaryActionComponent,
  SkySummaryActionBarSecondaryActionsComponent
} from './actions';

import {
  SkySummaryActionBarSummaryComponent
} from './summary';

import {
  SkySummaryActionBarAdapterService
} from './summary-action-bar-adapter.service';

@NgModule({
  declarations: [
    SkySummaryActionBarActionsComponent,
    SkySummaryActionBarCancelComponent,
    SkySummaryActionBarComponent,
    SkySummaryActionBarPrimaryActionComponent,
    SkySummaryActionBarSecondaryActionComponent,
    SkySummaryActionBarSecondaryActionsComponent,
    SkySummaryActionBarSummaryComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    SkyChevronModule,
    SkyDropdownModule,
    SkyI18nModule,
    SkyIconModule,
    SkyActionBarsResourcesModule,
    SkyMediaQueryModule
  ],
  providers: [
    SkySummaryActionBarAdapterService
  ],
  exports: [
    SkySummaryActionBarComponent,
    SkySummaryActionBarActionsComponent,
    SkySummaryActionBarCancelComponent,
    SkySummaryActionBarPrimaryActionComponent,
    SkySummaryActionBarSecondaryActionComponent,
    SkySummaryActionBarSecondaryActionsComponent,
    SkySummaryActionBarSummaryComponent
  ]
})
export class SkySummaryActionBarModule { }
