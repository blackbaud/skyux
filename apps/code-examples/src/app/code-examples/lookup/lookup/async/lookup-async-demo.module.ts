import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule } from '@skyux/lookup';

import { LookupAsyncDemoComponent } from './lookup-async-demo.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyLookupModule,
  ],
  declarations: [LookupAsyncDemoComponent],
  exports: [LookupAsyncDemoComponent],
})
export class LookupAsyncDemoModule {}
