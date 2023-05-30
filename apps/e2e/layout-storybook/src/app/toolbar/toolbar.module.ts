import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyIconModule } from '@skyux/indicators';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyThemeModule } from '@skyux/theme';

import { ToolbarComponent } from './toolbar.component';

const routes: Routes = [{ path: '', component: ToolbarComponent }];
@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyIconModule,
    SkyThemeModule,
    SkyToolbarModule,
  ],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
