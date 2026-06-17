import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SkyPopoverModule } from '../popover.module';

/**
 * Fixture used to test accessibility features.
 */
@Component({
  imports: [SkyPopoverModule],
  selector: 'sky-popover-test',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button data-sky-id="triggerEl" type="button" [skyPopover]="popover1">
      What's this?
    </button>
    <sky-popover #popover1> Some help message. </sky-popover>
  `,
})
export class PopoverA11yTestComponent {}
