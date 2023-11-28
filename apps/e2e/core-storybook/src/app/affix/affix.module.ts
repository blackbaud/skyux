import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyAffixModule } from '@skyux/core';

import { AffixComponent } from './affix.component';

const routes: Routes = [{ path: '', component: AffixComponent }];
@NgModule({
  declarations: [AffixComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkyAffixModule],
  exports: [AffixComponent],
})
export class AffixModule {}
