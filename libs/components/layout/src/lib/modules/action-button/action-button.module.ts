import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkyIconModule } from '@skyux/indicators';
import { SkyHrefModule } from '@skyux/router';
import { SkyThemeModule } from '@skyux/theme';

import { SkyActionButtonContainerComponent } from './action-button-container.component';
import { SkyActionButtonDetailsComponent } from './action-button-details.component';
import { SkyActionButtonHeaderComponent } from './action-button-header.component';
import { SkyActionButtonIconComponent } from './action-button-icon.component';
import { SkyActionButtonComponent } from './action-button.component';

@NgModule({
  declarations: [
    SkyActionButtonComponent,
    SkyActionButtonContainerComponent,
    SkyActionButtonDetailsComponent,
    SkyActionButtonHeaderComponent,
    SkyActionButtonIconComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SkyHrefModule,
    SkyIconModule,
    SkyThemeModule,
  ],
  exports: [
    SkyActionButtonComponent,
    SkyActionButtonContainerComponent,
    SkyActionButtonDetailsComponent,
    SkyActionButtonHeaderComponent,
    SkyActionButtonIconComponent,
  ],
})
export class SkyActionButtonModule {}
