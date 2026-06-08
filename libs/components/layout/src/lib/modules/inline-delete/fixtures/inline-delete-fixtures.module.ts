import { NgModule } from '@angular/core';

import { SkyInlineDeleteModule } from '../inline-delete.module';

import { InlineDeleteTestComponent } from './inline-delete.component.fixture';

@NgModule({
  declarations: [InlineDeleteTestComponent],
  imports: [SkyInlineDeleteModule],
  exports: [InlineDeleteTestComponent],
})
export class SkyInlineDeleteFixturesModule {}
