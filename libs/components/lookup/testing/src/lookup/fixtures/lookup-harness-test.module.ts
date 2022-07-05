import { NgModule } from '@angular/core';
import { SkyLookupModule } from '@skyux/lookup';

import { LookupHarnessTestComponent } from './lookup-harness-test.component';

@NgModule({
  declarations: [LookupHarnessTestComponent],
  imports: [SkyLookupModule],
})
export class LookupHarnessTestModule {}
