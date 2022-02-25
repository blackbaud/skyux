import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import { SkyIdModule } from '@skyux/core';

import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';

import { SkyLookupModule } from '@skyux/lookup';

import { SkyModalModule } from '@skyux/modals';

import { LookupCustomPickerDemoComponent } from './lookup-custom-picker-demo.component';

import { LookupCustomPickerDemoModalComponent } from './lookup-custom-picker-demo-modal.component';

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
  entryComponents: [LookupCustomPickerDemoModalComponent],
})
export class LookupCustomPickerDemoModule {}
