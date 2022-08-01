import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyModalModule } from '@skyux/modals';
import { SkyTabsModule } from '@skyux/tabs';

import { WizardModalComponent } from './wizard-modal.component';
import { WizardComponent } from './wizard.component';

const routes: Routes = [{ path: '', component: WizardComponent }];
@NgModule({
  declarations: [WizardComponent, WizardModalComponent],
  entryComponents: [WizardModalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyCheckboxModule,
    SkyInputBoxModule,
    SkyTabsModule,
    SkyModalModule,
    ReactiveFormsModule,
  ],
  exports: [WizardComponent],
})
export class WizardModule {}
