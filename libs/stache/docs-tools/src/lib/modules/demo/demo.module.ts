import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyCheckboxModule, SkyRadioModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/indicators';
import { SkyThemeModule } from '@skyux/theme';

import { SkyDocsToolsResourcesModule } from '../shared/sky-docs-tools-resources.module';

import { SkyDocsDemoControlPanelCheckboxComponent } from './demo-control-panel-checkbox.component';
import { SkyDocsDemoControlPanelRadioGroupComponent } from './demo-control-panel-radio-group.component';
import { SkyDocsDemoControlPanelSectionComponent } from './demo-control-panel-section.component';
import { SkyDocsDemoControlPanelComponent } from './demo-control-panel.component';
import { SkyDocsDemoComponent } from './demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule,
    SkyDocsToolsResourcesModule,
    SkyIconModule,
    SkyRadioModule,
    SkyThemeModule,
  ],
  declarations: [
    SkyDocsDemoComponent,
    SkyDocsDemoControlPanelCheckboxComponent,
    SkyDocsDemoControlPanelComponent,
    SkyDocsDemoControlPanelRadioGroupComponent,
    SkyDocsDemoControlPanelSectionComponent,
  ],
  exports: [
    SkyDocsDemoComponent,
    SkyDocsDemoControlPanelCheckboxComponent,
    SkyDocsDemoControlPanelComponent,
    SkyDocsDemoControlPanelRadioGroupComponent,
    SkyDocsDemoControlPanelSectionComponent,
  ],
})
export class SkyDocsDemoModule {}
