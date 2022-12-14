import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyColorpickerModule } from '@skyux/colorpicker';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyModalModule } from '@skyux/modals';
import { SkyActionHubModule } from '@skyux/pages';

import { ActionHubComponent } from './action-hub.component';
import { SettingsModalComponent } from './settings-modal.component';

const routes: Routes = [{ path: '', component: ActionHubComponent }];
@NgModule({
  declarations: [ActionHubComponent, SettingsModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SkyActionHubModule,
    SkyColorpickerModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyModalModule,
  ],
  exports: [ActionHubComponent],
})
export class ActionHubModule {}
