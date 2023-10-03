import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SkyIdModule } from '@skyux/core';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule } from '@skyux/lookup';

import { LookupRoutingModule } from './lookup-routing.module';
import { LookupComponent } from './lookup.component';

@NgModule({
  declarations: [LookupComponent],
  imports: [
    CommonModule,
    LookupRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyLookupModule,
    SkyIdModule,
    SkyInputBoxModule,
    RouterModule,
  ],
})
export class LookupModule {
  public static routes = LookupRoutingModule.routes;
}
