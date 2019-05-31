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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule,
    SkyDocsToolsResourcesModule,
    SkyRadioModule
  ],
  declarations: [
    SkyDocsDemoComponent,
    SkyDocsDemoControlPanelCheckboxComponent,
    SkyDocsDemoControlPanelComponent,
    SkyDocsDemoControlPanelRadioGroupComponent,
    SkyDocsDemoControlPanelSectionComponent
  ],
  exports: [
    SkyDocsDemoComponent,
    SkyDocsDemoControlPanelCheckboxComponent,
    SkyDocsDemoControlPanelComponent,
    SkyDocsDemoControlPanelRadioGroupComponent,
    SkyDocsDemoControlPanelSectionComponent
  ]
})
export class SkyDocsDemoModule { }
