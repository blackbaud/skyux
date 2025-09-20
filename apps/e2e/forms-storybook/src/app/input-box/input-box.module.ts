import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyIdModule } from '@skyux/core';
import { SkyCharacterCounterModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyIconModule } from '@skyux/icon';
import { SkyFluidGridModule } from '@skyux/layout';

import { InputBoxComponent } from './input-box.component';

const routes: Routes = [{ path: '', component: InputBoxComponent }];
@NgModule({
  declarations: [InputBoxComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SkyCharacterCounterModule,
    SkyFluidGridModule,
    SkyHelpInlineModule,
    SkyIconModule,
    SkyIdModule,
    SkyInputBoxModule,
  ],
  exports: [InputBoxComponent],
})
export class InputBoxModule {}
