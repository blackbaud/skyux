import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyPopoverAlignment,
  SkyPopoverModule,
  SkyPopoverPlacement,
} from '@skyux/popovers';

@Component({
  selector: 'sky-popover-test',
  templateUrl: './popover-harness-test.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyPopoverModule],
})
export class PopoverHarnessTestComponent {
  public popoverAlignment: SkyPopoverAlignment | undefined;
  public popoverBody = 'popover body';
  public popoverPlacement: SkyPopoverPlacement | undefined;
  public popoverTitle: string | undefined = 'popover title';
}
