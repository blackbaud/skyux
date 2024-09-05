import { Component } from '@angular/core';
import {
  SkyPopoverAlignment,
  SkyPopoverModule,
  SkyPopoverPlacement,
} from '@skyux/popovers';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyPopoverModule],
})
export class DemoComponent {
  protected dismissOnBlur: boolean | undefined;
  protected popoverAlignment: SkyPopoverAlignment | undefined;
  protected popoverBody = 'This is a popover.';
  protected popoverPlacement: SkyPopoverPlacement | undefined;
  protected popoverTitle: string | undefined = 'Did you know?';
}
