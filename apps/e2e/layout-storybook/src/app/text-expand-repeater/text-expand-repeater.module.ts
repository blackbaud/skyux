import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyTextExpandRepeaterModule } from '@skyux/layout';

import { TextExpandRepeaterComponent } from './text-expand-repeater.component';

const routes: Routes = [{ path: '', component: TextExpandRepeaterComponent }];
@NgModule({
  declarations: [TextExpandRepeaterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyTextExpandRepeaterModule,
  ],
  exports: [TextExpandRepeaterComponent],
})
export class TextExpandRepeaterModule {}
