import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyColorpickerModule } from '@skyux/colorpicker';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/indicators';
import { SkyModalModule } from '@skyux/modals';
import { SkyActionHubModule } from '@skyux/pages';

import { ActionHubDemoComponent } from './action-hub-demo.component';
import { SettingsModalComponent } from './settings-modal.component';

@NgModule({
  declarations: [ActionHubDemoComponent, SettingsModalComponent],
  exports: [ActionHubDemoComponent],
  imports: [
    CommonModule,
    SkyActionHubModule,
    SkyColorpickerModule,
    SkyIconModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyModalModule,
    ReactiveFormsModule,
  ],
})
export class ActionHubDemoModule {}
