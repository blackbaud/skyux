import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyKeyInfoModule } from '../';
import { KeyInfoTestComponent } from './key-info.component.fixture';

@NgModule({
  declarations: [
    KeyInfoTestComponent
  ],
  imports: [
    CommonModule,
    SkyKeyInfoModule
  ],
  exports: [
    KeyInfoTestComponent
  ]
})
export class SkyKeyInfoFixturesModule { }
