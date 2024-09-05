import { NgModule } from '@angular/core';

import { SkyInlineFormModule } from '../inline-form.module';

import { SkyInlineFormFixtureComponent } from './inline-form.fixture';

@NgModule({
  declarations: [SkyInlineFormFixtureComponent],
  imports: [SkyInlineFormModule],
})
export class SkyInlineFormFixtureModule {}
