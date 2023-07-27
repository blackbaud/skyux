import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule } from '@skyux/lookup';
import { SkyModalModule } from '@skyux/modals';

import { LookupAsyncDemoComponent } from './lookup-async-demo.component';
import { LookupDemoAddItemComponent } from './lookup-demo-add-item.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyLookupModule,
  ],
  declarations: [LookupAsyncDemoComponent, LookupDemoAddItemComponent],
  exports: [LookupAsyncDemoComponent],
})
export class LookupAsyncDemoModule {}
