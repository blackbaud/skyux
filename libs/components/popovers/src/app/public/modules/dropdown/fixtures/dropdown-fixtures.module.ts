import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SkyDropdownModule } from '../index';
import { DropdownTestComponent } from './dropdown.component.fixture';

@NgModule({
  declarations: [
    DropdownTestComponent
  ],
  imports: [
    CommonModule,
    NoopAnimationsModule,
    SkyDropdownModule
  ],
  exports: [
    DropdownTestComponent
  ]
})
export class SkyDropdownFixturesModule { }
