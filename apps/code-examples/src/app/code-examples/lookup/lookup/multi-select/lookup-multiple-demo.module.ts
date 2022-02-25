import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import { SkyIdModule } from '@skyux/core';

import { SkyInputBoxModule } from '@skyux/forms';

import { SkyLookupModule } from 'projects/lookup/src/public-api';

import { LookupMultipleSelectDemoComponent } from './lookup-multiple-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyLookupModule,
  ],
  declarations: [LookupMultipleSelectDemoComponent],
  exports: [LookupMultipleSelectDemoComponent],
})
export class LookupMultipleSelectDemoModule {}
