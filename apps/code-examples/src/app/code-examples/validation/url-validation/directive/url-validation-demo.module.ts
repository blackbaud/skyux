import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyStatusIndicatorModule } from '@skyux/indicators';
import { SkyUrlValidationModule } from '@skyux/validation';

import { UrlValidationDemoComponent } from './url-validation-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyInputBoxModule,
    SkyStatusIndicatorModule,
    SkyUrlValidationModule,
  ],
  exports: [UrlValidationDemoComponent],
  declarations: [UrlValidationDemoComponent],
})
export class UrlValidationDemoModule {}
