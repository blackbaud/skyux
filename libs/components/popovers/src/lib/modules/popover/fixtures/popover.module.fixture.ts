import { NgModule } from '@angular/core';
import { provideNoopSkyAnimations } from '@skyux/core';

import { SkyPopoverModule } from '../popover.module';

import { PopoverFixtureComponent } from './popover.component.fixture';

@NgModule({
  imports: [SkyPopoverModule],
  exports: [PopoverFixtureComponent],
  declarations: [PopoverFixtureComponent],
  providers: [provideNoopSkyAnimations()],
})
export class PopoverFixturesModule {}
