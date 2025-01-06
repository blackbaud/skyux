import { Component, Optional } from '@angular/core';

import { OverlayFixtureContext } from './overlay-context.fixture';

@Component({
  selector: 'sky-overlay-entry-test',
  template: `Overlay content ID: {{ contentId }}`,
  standalone: false,
})
export class OverlayEntryFixtureComponent {
  public contentId: string;

  constructor(@Optional() context?: OverlayFixtureContext) {
    this.contentId = context?.id ?? 'none';
  }
}
