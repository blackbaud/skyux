import { Component } from '@angular/core';
import { SkyPopoverAlignment, SkyPopoverPlacement } from '@skyux/popovers';

@Component({
  selector: 'app-popover-demo',
  templateUrl: './popover-demo.component.html',
})
export class PopoverDemoComponent {
  public dismissOnBlur: boolean | undefined;
  public popoverAlignment: SkyPopoverAlignment | undefined;
  public popoverBody = 'This is a popover.';
  public popoverPlacement: SkyPopoverPlacement | undefined;
  public popoverTitle: string | undefined = 'Did you know?';
}
