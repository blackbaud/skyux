import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule } from '@skyux/lookup';

import { LookupSingleSelectDemoComponent } from './lookup-single-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyLookupModule,
  ],
  declarations: [LookupSingleSelectDemoComponent],
  exports: [LookupSingleSelectDemoComponent],
})
export class LookupSingleSelectDemoModule {}
