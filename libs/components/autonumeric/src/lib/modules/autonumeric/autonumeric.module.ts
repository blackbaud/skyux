import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SkyAutonumericDirective } from './autonumeric.directive';

@NgModule({
  declarations: [SkyAutonumericDirective],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [SkyAutonumericDirective],
})
export class SkyAutonumericModule {}
