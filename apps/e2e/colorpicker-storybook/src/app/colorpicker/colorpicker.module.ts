import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyColorpickerModule } from '@skyux/colorpicker';

import { ColorpickerComponent } from './colorpicker.component';

const routes: Routes = [{ path: '', component: ColorpickerComponent }];
@NgModule({
  declarations: [ColorpickerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SkyColorpickerModule,
  ],
  exports: [ColorpickerComponent],
})
export class ColorpickerModule {}
