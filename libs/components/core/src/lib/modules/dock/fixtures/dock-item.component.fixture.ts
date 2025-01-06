import { Component, Optional } from '@angular/core';

import { DockItemFixtureContext } from './dock-item-context.fixture';

@Component({
  selector: 'sky-dock-item-test',
  templateUrl: './dock-item.component.fixture.html',
  standalone: false,
})
export class DockItemFixtureComponent {
  public height: number | undefined;

  constructor(@Optional() context?: DockItemFixtureContext) {
    this.height = context?.args.height;
  }
}
