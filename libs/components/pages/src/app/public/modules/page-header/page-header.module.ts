import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkyIconModule } from '@skyux/indicators';
import { SkyThemeModule } from '@skyux/theme';

import { SkyPageHeaderComponent } from './page-header.component';

@NgModule({
  imports: [CommonModule, RouterModule, SkyIconModule, SkyThemeModule],
  declarations: [SkyPageHeaderComponent],
  exports: [SkyPageHeaderComponent]
})
export class SkyPageHeaderModule {}
