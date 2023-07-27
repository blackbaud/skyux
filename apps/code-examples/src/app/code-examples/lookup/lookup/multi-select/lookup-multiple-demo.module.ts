import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule } from '@skyux/lookup';

import { LookupMultipleSelectDemoComponent } from './lookup-multiple-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyLookupModule,
  ],
  declarations: [LookupMultipleSelectDemoComponent],
  exports: [LookupMultipleSelectDemoComponent],
})
export class LookupMultipleSelectDemoModule {}
