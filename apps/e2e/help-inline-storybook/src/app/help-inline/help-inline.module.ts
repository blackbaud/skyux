import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { HelpInlineComponent } from './help-inline.component';

const routes: Routes = [{ path: '', component: HelpInlineComponent }];
@NgModule({
  declarations: [HelpInlineComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkyHelpInlineModule],
  exports: [HelpInlineComponent],
})
export class HelpInlineModule {}
