import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyModalModule } from '@skyux/modals';
import { SkyPhoneFieldModule } from '@skyux/phone-field';
import { SkyTabsModule } from '@skyux/tabs';
import { SkyThemeModule } from '@skyux/theme';

import { WizardDemoModalComponent } from './wizard-demo-modal.component';
import { WizardDemoComponent } from './wizard-demo.component';

@NgModule({
  declarations: [WizardDemoComponent, WizardDemoModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyFluidGridModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyPhoneFieldModule,
    SkyStatusIndicatorModule,
    SkyTabsModule,
    SkyThemeModule,
  ],
})
export class WizardDemoModule {}
