import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SkyInlineDeleteModule } from '../inline-delete.module';

import { InlineDeleteTestComponent } from './inline-delete.component.fixture';

@NgModule({
  declarations: [InlineDeleteTestComponent],
  imports: [NoopAnimationsModule, SkyInlineDeleteModule],
  exports: [InlineDeleteTestComponent],
})
export class SkyInlineDeleteFixturesModule {}
