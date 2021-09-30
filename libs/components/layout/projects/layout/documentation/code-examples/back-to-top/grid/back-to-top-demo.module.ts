import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyGridModule
} from '@skyux/grids';

import {
  SkyTabsModule
} from '@skyux/tabs';

import {
  BackToTopDemoComponent
} from './back-to-top-demo.component';
import { SkyBackToTopModule } from 'projects/layout/src/public-api';

@NgModule({
  imports: [
    CommonModule,
    SkyBackToTopModule,
    SkyGridModule,
    SkyTabsModule
  ],
  declarations: [
    BackToTopDemoComponent
  ],
  exports: [
    BackToTopDemoComponent
  ]
})
export class BackToTopDemoModule { }
