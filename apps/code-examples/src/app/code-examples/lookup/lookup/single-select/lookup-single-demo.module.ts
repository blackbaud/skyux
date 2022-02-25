import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';

import { SkyIdModule } from '@skyux/core';

import { SkyInputBoxModule } from '@skyux/forms';

import { SkyLookupModule } from 'projects/lookup/src/public-api';

import { LookupSingleSelectDemoComponent } from './lookup-single-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyLookupModule,
  ],
  declarations: [LookupSingleSelectDemoComponent],
  exports: [LookupSingleSelectDemoComponent],
})
export class LookupSingleSelectDemoModule {}
