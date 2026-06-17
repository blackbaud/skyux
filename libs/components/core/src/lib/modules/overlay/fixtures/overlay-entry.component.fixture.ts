import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { OverlayFixtureContext } from './overlay-context.fixture';

@Component({
  selector: 'sky-overlay-entry-test',
  template: `Overlay content ID: {{ contentId }}`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class OverlayEntryFixtureComponent {
  public readonly contentId =
    inject(OverlayFixtureContext, { optional: true })?.id ?? 'none';
}
