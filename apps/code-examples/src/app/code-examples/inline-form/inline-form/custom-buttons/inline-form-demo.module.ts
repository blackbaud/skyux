import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';

import { SkyIdModule } from '@skyux/core';

import { SkyInputBoxModule } from '@skyux/forms';

import { SkyIconModule } from '@skyux/indicators';

import { SkyInlineFormModule } from 'projects/inline-form/src/public-api';

import { InlineFormDemoComponent } from './inline-form-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyIconModule,
    SkyIdModule,
    SkyInlineFormModule,
    SkyInputBoxModule,
  ],
  exports: [InlineFormDemoComponent],
  declarations: [InlineFormDemoComponent],
})
export class InlineFormDemoModule {}
