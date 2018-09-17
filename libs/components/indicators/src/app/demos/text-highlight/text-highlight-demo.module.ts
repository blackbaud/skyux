import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyTextHighlightModule
} from '../../public';

import {
  SkyTextHighlightDemoComponent
} from './text-highlight-demo.component';

@NgModule({
  declarations: [
    SkyTextHighlightDemoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyTextHighlightModule
  ],
  exports: [
    SkyTextHighlightDemoComponent
  ]
})
export class SkyTextHighlightDemoModule {}
