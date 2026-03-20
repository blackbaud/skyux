import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule } from '@skyux/lookup';

import { LookupHarnessTestComponent } from './lookup-harness-test.component';

@NgModule({
  declarations: [LookupHarnessTestComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyLookupModule,
  ],
})
export class LookupHarnessTestModule {}
