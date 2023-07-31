import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyAutonumericModule } from '@skyux/autonumeric';
import { SkyInputBoxModule } from '@skyux/forms';

import { AutonumericDemoComponent } from './autonumeric-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyAutonumericModule,
    SkyInputBoxModule,
  ],
  declarations: [AutonumericDemoComponent],
  exports: [AutonumericDemoComponent],
})
export class AutonumericDemoModule {}
