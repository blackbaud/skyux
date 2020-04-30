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
  SkyCheckboxModule,
  SkyRadioModule
} from '@skyux/forms';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyThemeModule
} from '@skyux/theme';

import {
  SkyRestrictedViewModule
} from '@blackbaud/skyux-lib-restricted-view';

import {
  SkyDocsToolsResourcesModule
} from '../shared/docs-tools-resources.module';

import {
  SkyDocsDemoComponent
} from './demo.component';

import {
  SkyDocsDemoControlPanelCheckboxComponent
} from './demo-control-panel-checkbox.component';

import {
  SkyDocsDemoControlPanelComponent
} from './demo-control-panel.component';

import {
  SkyDocsDemoControlPanelRadioGroupComponent
} from './demo-control-panel-radio-group.component';

import {
  SkyDocsDemoControlPanelSectionComponent
} from './demo-control-panel-section.component';

import {
  SkyDocsDemoControlPanelThemeComponent
} from './demo-control-panel-theme.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule,
    SkyDocsToolsResourcesModule,
    SkyIconModule,
    SkyRadioModule,
    SkyRestrictedViewModule,
    SkyThemeModule
  ],
  declarations: [
    SkyDocsDemoComponent,
    SkyDocsDemoControlPanelCheckboxComponent,
    SkyDocsDemoControlPanelComponent,
    SkyDocsDemoControlPanelRadioGroupComponent,
    SkyDocsDemoControlPanelSectionComponent,
    SkyDocsDemoControlPanelThemeComponent
  ],
  exports: [
    SkyDocsDemoComponent,
    SkyDocsDemoControlPanelCheckboxComponent,
    SkyDocsDemoControlPanelComponent,
    SkyDocsDemoControlPanelRadioGroupComponent,
    SkyDocsDemoControlPanelSectionComponent,
    SkyDocsDemoControlPanelThemeComponent
  ]
})
export class SkyDocsDemoModule { }
