import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  ]
})
export class SkyTokensFixturesModule { }
