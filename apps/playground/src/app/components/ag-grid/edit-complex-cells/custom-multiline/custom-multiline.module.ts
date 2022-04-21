import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CustomMultilineComponent } from './custom-multiline.component';

@NgModule({
  declarations: [CustomMultilineComponent],
  imports: [CommonModule],
  exports: [CustomMultilineComponent],
  entryComponents: [CustomMultilineComponent],
})
export class CustomMultilineModule {}
