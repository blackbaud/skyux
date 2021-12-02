import { Component, Optional } from '@angular/core';

import { DockItemFixtureContext } from './dock-item-context.fixture';

@Component({
  selector: 'sky-dock-item-test',
  templateUrl: './dock-item.component.fixture.html',
})
export class DockItemFixtureComponent {
  public height: number;

  constructor(@Optional() context: DockItemFixtureContext) {
    this.height = context && context.args && context.args.height;
  }
}
