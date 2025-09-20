import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyThemeModule } from '@skyux/theme';

import { SkyListsResourcesModule } from '../shared/sky-lists-resources.module';

import { SkyPagingContentComponent } from './paging-content.component';
import { SkyPagingComponent } from './paging.component';

@NgModule({
  declarations: [SkyPagingComponent],
  imports: [
    CommonModule,
    SkyIconModule,
    SkyListsResourcesModule,
    SkyPagingContentComponent,
    SkyThemeModule,
    SkyWaitModule,
  ],
  exports: [SkyPagingComponent, SkyPagingContentComponent],
})
export class SkyPagingModule {}
