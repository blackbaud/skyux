import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import { SkyIdModule } from '@skyux/core';

import { SkyModalModule } from '@skyux/modals';

import { SkySelectFieldModule } from '@skyux/select-field';

import { SelectFieldDemoComponent } from './select-field-demo.component';

import { SelectFieldDemoCustomPickerComponent } from './select-field-demo-custom-picker.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyIdModule,
    SkyModalModule,
    SkySelectFieldModule,
  ],
  declarations: [
    SelectFieldDemoComponent,
    SelectFieldDemoCustomPickerComponent,
  ],
  entryComponents: [SelectFieldDemoCustomPickerComponent],
  exports: [SelectFieldDemoComponent],
})
export class SelectFieldDemoModule {}
