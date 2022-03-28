import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyModalModule } from '@skyux/modals';
import { SkyProgressIndicatorModule } from '@skyux/progress-indicator';

import { WizardDemoModalComponent } from './wizard-demo-modal.component';
import { WizardDemoComponent } from './wizard-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyModalModule,
    SkyProgressIndicatorModule,
  ],
  exports: [WizardDemoComponent],
  declarations: [WizardDemoComponent, WizardDemoModalComponent],
})
export class SkyProgressIndicatorPassiveDemoModule {}
