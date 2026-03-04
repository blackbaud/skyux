import { NgModule } from '@angular/core';

import { SkyPopoverModule } from '../popover.module';

import { PopoverFixtureComponent } from './popover.component.fixture';

@NgModule({
  imports: [SkyPopoverModule],
  exports: [PopoverFixtureComponent],
  declarations: [PopoverFixtureComponent],
})
export class PopoverFixturesModule {}
