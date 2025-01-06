import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyRadioModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';
import { SkyThemeModule } from '@skyux/theme';

import { ToolbarComponent } from './toolbar.component';

const routes: Routes = [{ path: '', component: ToolbarComponent }];
@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SkyIconModule,
    SkyRadioModule,
    SkySearchModule,
    SkyThemeModule,
    SkyToolbarModule,
  ],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
