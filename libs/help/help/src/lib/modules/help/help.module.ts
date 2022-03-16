import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HelpComponent } from './help.component';

@NgModule({
  declarations: [HelpComponent],
  imports: [CommonModule],
  exports: [HelpComponent],
})
export class HelpModule {}
