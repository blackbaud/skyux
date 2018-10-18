import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  SkyLibResourcesTestService
} from '@skyux/i18n/testing';

import { SkyTokensModule } from '../tokens.module';
import { SkyTokensTestComponent } from './tokens.component.fixture';

@NgModule({
  declarations: [
    SkyTokensTestComponent
  ],
  imports: [
    CommonModule,
    SkyTokensModule
  ],
  exports: [
    SkyTokensTestComponent
  ],
  providers: [
    {
      provide: SkyLibResourcesService,
      useClass: SkyLibResourcesTestService
    }
  ]
})
export class SkyTokensFixturesModule { }
