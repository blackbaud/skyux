import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyErrorModule } from '@skyux/errors';

import { ErrorDemoComponent } from './error-demo.component';

@NgModule({
  imports: [CommonModule, SkyErrorModule],
  declarations: [ErrorDemoComponent],
  exports: [ErrorDemoComponent],
})
export class ErrorDemoModule {}
