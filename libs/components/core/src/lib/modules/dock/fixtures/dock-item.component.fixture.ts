import { Component, inject } from '@angular/core';

import { DockItemFixtureContext } from './dock-item-context.fixture';

@Component({
  selector: 'sky-dock-item-test',
  templateUrl: './dock-item.component.fixture.html',
  standalone: false,
})
export class DockItemFixtureComponent {
  public readonly height = inject(DockItemFixtureContext, { optional: true })
    ?.args.height;
}
