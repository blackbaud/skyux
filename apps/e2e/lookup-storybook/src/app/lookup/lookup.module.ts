import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule } from '@skyux/lookup';

import { LookupComponent } from './lookup.component';

const routes: Routes = [{ path: '', component: LookupComponent }];
@NgModule({
  declarations: [LookupComponent],
  imports: [
    SkyInputBoxModule,
    ReactiveFormsModule,
    SkyLookupModule,
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [LookupComponent],
})
export class LookupModule {}
