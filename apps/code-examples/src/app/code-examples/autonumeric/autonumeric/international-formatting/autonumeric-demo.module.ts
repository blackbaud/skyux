import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';

import { SkyAutonumericModule } from 'projects/sky-autonumeric/src/public-api';

import { AutonumericDemoComponent } from './autonumeric-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyAutonumericModule,
    SkyIdModule,
    SkyInputBoxModule,
  ],
  declarations: [AutonumericDemoComponent],
  exports: [AutonumericDemoComponent],
})
export class AutonumericDemoModule {}
