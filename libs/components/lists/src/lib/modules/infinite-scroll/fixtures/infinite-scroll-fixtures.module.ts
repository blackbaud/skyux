import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyInfiniteScrollModule } from '../infinite-scroll.module';

import { SkyInfiniteScrollTestComponent } from './infinite-scroll.component.fixture';

@NgModule({
  declarations: [SkyInfiniteScrollTestComponent],
  imports: [CommonModule, SkyInfiniteScrollModule],
  exports: [SkyInfiniteScrollTestComponent],
})
export class SkyInfiniteScrollFixturesModule {}
