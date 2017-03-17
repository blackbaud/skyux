import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { StachePageAnchorModule } from '../page-anchor/page-anchor.module';
import { StacheLayoutModule } from '../layout/layout.module';

import { StacheWrapperComponent } from './wrapper.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    StachePageAnchorModule,
    StacheLayoutModule
  ],
  declarations: [
    StacheWrapperComponent
  ],
  exports: [
    StacheWrapperComponent
  ],
  providers: [
    Title
  ]
})
export class StacheWrapperModule { }
