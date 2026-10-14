import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyButton, SkyRadioModule } from '@skyux/forms';
import { SkyBoxModule, SkyToolbarModule } from '@skyux/layout';
import { SkyFilterModule } from '@skyux/lists';
import { SkySearchModule } from '@skyux/lookup';
import { SkyThemeModule } from '@skyux/theme';

import { ToolbarComponent } from './toolbar.component';

const routes: Routes = [{ path: '', component: ToolbarComponent }];
@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    SkyButton,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SkyBoxModule,
    SkyRadioModule,
    SkyFilterModule,
    SkySearchModule,
    SkyThemeModule,
    SkyToolbarModule,
  ],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
