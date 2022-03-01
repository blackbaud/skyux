import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SkyPopoverModule } from '../popover.module';

import { PopoverFixtureComponent } from './popover.component.fixture';

@NgModule({
  imports: [CommonModule, NoopAnimationsModule, SkyPopoverModule],
  exports: [PopoverFixtureComponent],
  declarations: [PopoverFixtureComponent],
})
export class PopoverFixturesModule {}
