import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';
import { SkyPageModule } from '@skyux/pages';

import { SearchComponent } from './search.component';

const routes: Routes = [{ path: '', component: SearchComponent }];
@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyPageModule,
    SkySearchModule,
    SkyToolbarModule,
  ],
  exports: [SearchComponent],
})
export class SearchModule {}
