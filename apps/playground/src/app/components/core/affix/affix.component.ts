import { Component } from '@angular/core';
import { SkyPopoverAlignment, SkyPopoverPlacement } from '@skyux/popovers';

@Component({
  selector: 'app-affix',
  templateUrl: './affix.component.html',
  styleUrl: './affix.component.css',
  standalone: false,
})
export class AffixComponent {
  public popoverAlignment: SkyPopoverAlignment | undefined;
  public popoverBody = 'This is a popover.';
  public popoverPlacement: SkyPopoverPlacement | undefined;
  public popoverTitle: string | undefined = 'Did you know?';
}
