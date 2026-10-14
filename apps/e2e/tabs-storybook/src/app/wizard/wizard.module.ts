import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyButton } from '@skyux/forms';

import { WizardComponent } from './wizard.component';

const routes: Routes = [{ path: '', component: WizardComponent }];
@NgModule({
  declarations: [WizardComponent],
  imports: [SkyButton, RouterModule.forChild(routes)],
  exports: [WizardComponent],
})
export class WizardModule {}
