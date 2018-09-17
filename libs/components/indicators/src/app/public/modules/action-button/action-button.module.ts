import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SkyMediaQueryModule } from '@skyux/core/modules/media-query';

import { SkyActionButtonComponent } from './action-button.component';
import { SkyActionButtonIconComponent } from './action-button-icon.component';
import { SkyActionButtonHeaderComponent } from './action-button-header.component';
import { SkyActionButtonDetailsComponent } from './action-button-details.component';
import { SkyActionButtonContainerComponent } from './action-button-container.component';
import { SkyIconModule } from '../icon';

@NgModule({
  declarations: [
    SkyActionButtonComponent,
    SkyActionButtonIconComponent,
    SkyActionButtonHeaderComponent,
    SkyActionButtonDetailsComponent,
    SkyActionButtonContainerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SkyMediaQueryModule,
    SkyIconModule
  ],
  exports: [
    SkyActionButtonComponent,
    SkyActionButtonIconComponent,
    SkyActionButtonHeaderComponent,
    SkyActionButtonDetailsComponent,
    SkyActionButtonContainerComponent
  ]
})
export class SkyActionButtonModule { }
