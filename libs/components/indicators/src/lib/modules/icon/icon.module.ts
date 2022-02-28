import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyThemeIconManifestModule } from '@skyux/theme';

import { SkyIconClassListPipe } from './icon-class-list.pipe';
import { SkyIconStackComponent } from './icon-stack.component';
import { SkyIconComponent } from './icon.component';

@NgModule({
  declarations: [SkyIconClassListPipe, SkyIconComponent, SkyIconStackComponent],
  imports: [CommonModule, SkyThemeIconManifestModule],
  exports: [SkyIconComponent, SkyIconStackComponent],
})
export class SkyIconModule {}
