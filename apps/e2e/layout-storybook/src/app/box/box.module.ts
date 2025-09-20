import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyBoxModule } from '@skyux/layout';
import { SkyDropdownModule } from '@skyux/popovers';

import { BoxComponent } from './box.component';

const routes: Routes = [{ path: '', component: BoxComponent }];
@NgModule({
  declarations: [BoxComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyBoxModule,
    SkyHelpInlineModule,
    SkyDropdownModule,
  ],
  exports: [BoxComponent],
})
export class BoxModule {}
