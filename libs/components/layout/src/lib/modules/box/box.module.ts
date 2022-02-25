import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';
import { SkyThemeModule } from '@skyux/theme';
import { SkyBoxContentComponent } from './box-content.component';
import { SkyBoxControlsComponent } from './box-controls.component';
import { SkyBoxHeaderComponent } from './box-header.component';
import { SkyBoxComponent } from './box.component';

@NgModule({
  declarations: [
    SkyBoxComponent,
    SkyBoxHeaderComponent,
    SkyBoxContentComponent,
    SkyBoxControlsComponent,
  ],
  imports: [CommonModule, SkyThemeModule],
  exports: [
    SkyBoxComponent,
    SkyBoxHeaderComponent,
    SkyBoxContentComponent,
    SkyBoxControlsComponent,
  ],
})
export class SkyBoxModule {}
