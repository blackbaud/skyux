import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StacheInternalDirective } from '.';
import { StacheAuthService } from './auth.service';
import { StacheInternalComponent } from './internal.component';

@NgModule({
  declarations: [
    StacheInternalDirective,
    StacheInternalComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    StacheAuthService
  ],
  exports: [
    StacheInternalDirective,
    StacheInternalComponent
  ]
})
export class StacheInternalModule { }
