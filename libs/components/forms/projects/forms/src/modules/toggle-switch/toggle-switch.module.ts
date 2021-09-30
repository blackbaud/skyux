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
  SkyToggleSwitchComponent
} from './toggle-switch.component';

import {
  SkyToggleSwitchLabelComponent
} from './toggle-switch-label.component';

@NgModule({
  declarations: [
    SkyToggleSwitchLabelComponent,
    SkyToggleSwitchComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    SkyToggleSwitchLabelComponent,
    SkyToggleSwitchComponent
  ]
})
export class SkyToggleSwitchModule { }
