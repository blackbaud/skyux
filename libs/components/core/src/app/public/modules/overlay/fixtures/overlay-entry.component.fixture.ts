import {
  Component,
  Optional
} from '@angular/core';

import {
  OverlayFixtureContext
} from './overlay-context.fixture';

@Component({
  selector: 'app-overlay-entry-test',
  template: `Overlay content ID: {{ contentId }}`
})
export class OverlayEntryFixtureComponent {

  public contentId: string;

  constructor(
    @Optional() context: OverlayFixtureContext
  ) {
    this.contentId = (context) ? context.id : 'none';
  }

}
