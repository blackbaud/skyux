import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InputsComponent } from './inputs.component';

const routes: Routes = [{ path: '', component: InputsComponent }];
@NgModule({
  declarations: [InputsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [InputsComponent],
})
export class InputsModule {}
