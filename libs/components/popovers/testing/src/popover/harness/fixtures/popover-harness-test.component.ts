import { Component } from '@angular/core';
import { SkyPopoverAlignment, SkyPopoverPlacement } from '@skyux/popovers';

@Component({
  selector: 'sky-popover-test',
  templateUrl: './popover-harness-test.component.html',
})
export class PopoverHarnessTestComponent {
  public dismissOnBlur: boolean | undefined;
  public popoverAlignment: SkyPopoverAlignment | undefined;
  public popoverBody = 'popover body';
  public popoverPlacement: SkyPopoverPlacement | undefined;
  public popoverTitle: string | undefined = 'popover title';
}
