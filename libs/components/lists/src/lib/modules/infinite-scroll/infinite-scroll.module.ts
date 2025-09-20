import { NgModule } from '@angular/core';
import { SkyWaitModule } from '@skyux/indicators';

import { SkyListsResourcesModule } from '../shared/sky-lists-resources.module';

import { SkyInfiniteScrollComponent } from './infinite-scroll.component';

@NgModule({
  declarations: [SkyInfiniteScrollComponent],
  imports: [SkyListsResourcesModule, SkyWaitModule],
  exports: [SkyInfiniteScrollComponent],
})
export class SkyInfiniteScrollModule {}
