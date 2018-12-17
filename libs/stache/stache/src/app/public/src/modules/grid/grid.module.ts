/**
 * @deprecated since version 2.15.0. update and use the @skyux/fluid-grid unless major bugs are discovered before full deprecation in v3.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheRowComponent } from './row.component';
import { StacheColumnComponent } from './column.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    StacheRowComponent,
    StacheColumnComponent
  ],
  exports: [
    StacheRowComponent,
    StacheColumnComponent
  ]
})
export class StacheGridModule { }
