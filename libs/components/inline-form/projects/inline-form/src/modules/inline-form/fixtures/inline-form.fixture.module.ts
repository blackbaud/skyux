import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { SkyInlineFormModule } from '../inline-form.module';

import { SkyInlineFormFixtureComponent } from './inline-form.fixture';

@NgModule({
  declarations: [SkyInlineFormFixtureComponent],
  imports: [CommonModule, SkyInlineFormModule],
})
export class SkyInlineFormFixtureModule {}
