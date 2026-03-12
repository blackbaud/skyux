import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyBoxModule, SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';

import { SearchComponent } from './search.component';

const routes: Routes = [{ path: '', component: SearchComponent }];
@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyBoxModule,
    SkySearchModule,
    SkyToolbarModule,
  ],
  exports: [SearchComponent],
})
export class SearchModule {}
