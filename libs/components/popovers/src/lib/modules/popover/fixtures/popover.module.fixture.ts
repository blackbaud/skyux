import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SkyPopoverModule } from '../popover.module';

import { PopoverFixtureComponent } from './popover.component.fixture';

@NgModule({
  imports: [NoopAnimationsModule, SkyPopoverModule],
  exports: [PopoverFixtureComponent],
  declarations: [PopoverFixtureComponent],
})
export class PopoverFixturesModule {}
