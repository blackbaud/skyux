import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StacheFooterComponent } from './footer.component';
import { StacheNavModule } from '../nav';

@NgModule({
  imports: [
    CommonModule,
    StacheNavModule
  ],
  declarations: [
    StacheFooterComponent
  ],
  exports: [
    StacheFooterComponent
  ],
  providers: []
})
export class StacheFooterModule { }
