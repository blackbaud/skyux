import { NgModule } from '@angular/core';

import { SkyTextExpandRepeaterModule } from '../text-expand-repeater.module';

import { TextExpandRepeaterTestComponent } from './text-expand-repeater.component.fixture';

@NgModule({
  imports: [SkyTextExpandRepeaterModule],
  exports: [TextExpandRepeaterTestComponent],
  declarations: [TextExpandRepeaterTestComponent],
})
export class TextExpandRepeaterFixturesModule {}
