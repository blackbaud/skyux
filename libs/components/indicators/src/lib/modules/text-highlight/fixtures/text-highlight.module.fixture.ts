import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SkyTextHighlightModule } from '../text-highlight.module';

import { SkyTextHighlightTestComponent } from './text-highlight.component.fixture';

@NgModule({
  declarations: [SkyTextHighlightTestComponent],
  imports: [CommonModule, SkyTextHighlightModule, FormsModule],
})
export class SkyTextHighlightFixtureModule {}
