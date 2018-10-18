import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  SkyLibResourcesTestService
} from '@skyux/i18n/testing';

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
  ],
  providers: [
    {
      provide: SkyLibResourcesService,
      useClass: SkyLibResourcesTestService
    }
  ]
})
export class SkyDropdownFixturesModule { }
