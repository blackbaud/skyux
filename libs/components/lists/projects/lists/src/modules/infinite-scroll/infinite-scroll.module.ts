import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { SkyWaitModule } from '@skyux/indicators';

import { SkyListsResourcesModule } from '../shared/sky-lists-resources.module';

import { SkyInfiniteScrollComponent } from './infinite-scroll.component';

@NgModule({
  declarations: [SkyInfiniteScrollComponent],
  imports: [CommonModule, SkyListsResourcesModule, SkyWaitModule],
  exports: [SkyInfiniteScrollComponent],
})
export class SkyInfiniteScrollModule {}
