import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyInfiniteScrollModule } from '@skyux/lists';

import { InfiniteScrollComponent } from './infinite-scroll.component';

const routes: Routes = [{ path: '', component: InfiniteScrollComponent }];
@NgModule({
  declarations: [InfiniteScrollComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyInfiniteScrollModule,
  ],
  exports: [InfiniteScrollComponent],
})
export class InfiniteScrollModule {}
