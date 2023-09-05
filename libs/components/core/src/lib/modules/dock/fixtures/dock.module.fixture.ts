import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DockItemFixtureComponent } from './dock-item.component.fixture';
import { DockFixtureComponent } from './dock.component.fixture';

@NgModule({
  imports: [CommonModule],
  exports: [DockFixtureComponent, DockItemFixtureComponent],
  declarations: [DockFixtureComponent, DockItemFixtureComponent],
})
export class DockFixturesModule {}
