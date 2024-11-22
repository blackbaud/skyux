import { NgModule } from '@angular/core';
import { SkyInfiniteScrollModule } from '@skyux/lists';

import { InfiniteScrollHarnessTestComponent } from './infinite-scroll-harness-test.component';

@NgModule({
  imports: [SkyInfiniteScrollModule],
  declarations: [InfiniteScrollHarnessTestComponent],
})
export class InfiniteScrollHarnessTestModule {}
