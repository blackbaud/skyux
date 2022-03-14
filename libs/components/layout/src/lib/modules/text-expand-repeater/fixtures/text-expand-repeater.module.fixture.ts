import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SkyTextExpandRepeaterModule } from '../text-expand-repeater.module';

import { TextExpandRepeaterTestComponent } from './text-expand-repeater.component.fixture';

@NgModule({
  imports: [CommonModule, NoopAnimationsModule, SkyTextExpandRepeaterModule],
  exports: [TextExpandRepeaterTestComponent],
  declarations: [TextExpandRepeaterTestComponent],
})
export class TextExpandRepeaterFixturesModule {}
