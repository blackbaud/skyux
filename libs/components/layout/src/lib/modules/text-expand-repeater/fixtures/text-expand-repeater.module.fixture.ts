import { NgModule } from '@angular/core';
import { provideNoopSkyAnimations } from '@skyux/core';

import { SkyTextExpandRepeaterModule } from '../text-expand-repeater.module';

import { TextExpandRepeaterTestComponent } from './text-expand-repeater.component.fixture';

@NgModule({
  imports: [SkyTextExpandRepeaterModule],
  exports: [TextExpandRepeaterTestComponent],
  declarations: [TextExpandRepeaterTestComponent],
  providers: [provideNoopSkyAnimations()],
})
export class TextExpandRepeaterFixturesModule {}
