import { Component } from '@angular/core';
import {
  SkyPopoverAlignment,
  SkyPopoverModule,
  SkyPopoverPlacement,
} from '@skyux/popovers';

/**
 * @title Popover with basic setup
 */
@Component({
  selector: 'app-popovers-popover-basic-example',
  templateUrl: './example.component.html',
  imports: [SkyPopoverModule],
})
export class PopoversPopoverBasicExampleComponent {
  public popoverAlignment: SkyPopoverAlignment | undefined;
  public popoverBody = 'This is a popover.';
  public popoverPlacement: SkyPopoverPlacement | undefined;
  public popoverTitle: string | undefined = 'Did you know?';
}
