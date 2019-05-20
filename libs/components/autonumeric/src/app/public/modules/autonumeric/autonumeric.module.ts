import { NgModule } from '@angular/core';
import { SkyAutonumericDirective } from './autonumeric.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    SkyAutonumericDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SkyAutonumericDirective
  ]
})
export class SkyAutonumericModule { }
