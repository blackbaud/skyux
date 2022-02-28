import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyModalModule } from '@skyux/modals';
import { SkySelectFieldModule } from '@skyux/select-field';

import { SelectFieldDemoCustomPickerComponent } from './select-field-demo-custom-picker.component';
import { SelectFieldDemoComponent } from './select-field-demo.component';

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
