import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyI18nModule } from '@skyux/i18n';

import { SkyIconModule } from '@skyux/indicators';

import { SkyToastResourcesModule } from '../shared/sky-toast-resources.module';

import { SkyToastBodyComponent } from './toast-body.component';

import { SkyToastComponent } from './toast.component';

import { SkyToasterComponent } from './toaster.component';

@NgModule({
  declarations: [SkyToastBodyComponent, SkyToastComponent, SkyToasterComponent],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyIconModule,
    SkyToastResourcesModule,
  ],
  exports: [SkyToastComponent],
  entryComponents: [
    SkyToastBodyComponent,
    SkyToastComponent,
    SkyToasterComponent,
  ],
})
export class SkyToastModule {}
