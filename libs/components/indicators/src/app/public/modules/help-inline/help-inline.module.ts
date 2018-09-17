import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyResourcesModule
} from '../resources';
import {
  SkyIconModule
} from '../icon';

import {
  SkyHelpInlineComponent
} from './help-inline.component';

@NgModule({
  declarations: [
    SkyHelpInlineComponent
  ],
  imports: [
    CommonModule,
    SkyResourcesModule,
    SkyIconModule
  ],
  exports: [
    SkyHelpInlineComponent
  ]
})
export class SkyHelpInlineModule { }
