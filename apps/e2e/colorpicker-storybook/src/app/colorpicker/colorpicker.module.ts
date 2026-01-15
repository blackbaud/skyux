import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ColorpickerComponent } from './colorpicker.component';

const routes: Routes = [{ path: '', component: ColorpickerComponent }];
@NgModule({
  imports: [ColorpickerComponent, RouterModule.forChild(routes)],
  exports: [ColorpickerComponent],
})
export class ColorpickerModule {}
