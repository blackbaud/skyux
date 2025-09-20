import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SkyTextHighlightModule } from '../text-highlight.module';

import { SkyTextHighlightTestComponent } from './text-highlight.component.fixture';

@NgModule({
  declarations: [SkyTextHighlightTestComponent],
  imports: [SkyTextHighlightModule, FormsModule],
})
export class SkyTextHighlightFixtureModule {}
