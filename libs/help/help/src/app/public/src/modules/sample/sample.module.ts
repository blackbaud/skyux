import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibrarySampleComponent } from './sample.component';

@NgModule({
  declarations: [
    LibrarySampleComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LibrarySampleComponent
  ]
})
export class LibrarySampleModule { }
