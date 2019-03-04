import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyNavbarModule } from '../';

import { SkyNavbarTestComponent } from './navbar.component.fixture';

@NgModule({
  declarations: [
    SkyNavbarTestComponent
  ],
  imports: [
    CommonModule,
    SkyNavbarModule
  ],
  exports: [
    SkyNavbarTestComponent
  ]
})
export class SkyNavbarFixturesModule { }
