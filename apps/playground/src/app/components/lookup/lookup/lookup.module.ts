import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SkyIdModule } from '@skyux/core';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule } from '@skyux/lookup';
import { SkyModalModule } from '@skyux/modals';

import { LookupCustomPickerComponent } from './lookup-custom-picker.component';
import { LookupRoutingModule } from './lookup-routing.module';
import { LookupComponent } from './lookup.component';

@NgModule({
  declarations: [LookupComponent, LookupCustomPickerComponent],
  imports: [
    CommonModule,
    LookupRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyLookupModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyModalModule,
    RouterModule,
  ],
})
export class LookupModule {}
