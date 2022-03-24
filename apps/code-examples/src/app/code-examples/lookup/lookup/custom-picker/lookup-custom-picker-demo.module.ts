import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule } from '@skyux/lookup';
import { SkyModalModule } from '@skyux/modals';

import { LookupCustomPickerDemoModalComponent } from './lookup-custom-picker-demo-modal.component';
import { LookupCustomPickerDemoComponent } from './lookup-custom-picker-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyLookupModule,
    SkyModalModule,
  ],
  declarations: [
    LookupCustomPickerDemoComponent,
    LookupCustomPickerDemoModalComponent,
  ],
  exports: [LookupCustomPickerDemoComponent],
})
export class LookupCustomPickerDemoModule {}
