import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule } from '@skyux/lookup';

import { LookupCustomPickerDemoComponent } from './lookup-custom-picker-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyLookupModule,
  ],
  declarations: [LookupCustomPickerDemoComponent],
  exports: [LookupCustomPickerDemoComponent],
})
export class LookupCustomPickerDemoModule {}
