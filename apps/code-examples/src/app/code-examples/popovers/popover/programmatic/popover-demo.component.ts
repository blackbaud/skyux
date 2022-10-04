import { Component } from '@angular/core';
import { SkyPopoverMessage, SkyPopoverMessageType } from '@skyux/popovers';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-popover-demo',
  templateUrl: './popover-demo.component.html',
})
export class PopoverDemoComponent {
  public popoverController = new Subject<SkyPopoverMessage>();

  #popoverOpen = false;

  public onPopoverStateChange(isOpen: boolean): void {
    this.#popoverOpen = isOpen;
  }

  public openPopover(): void {
    if (!this.#popoverOpen) {
      this.#sendMessage(SkyPopoverMessageType.Open);
    }
  }

  #sendMessage(type: SkyPopoverMessageType): void {
    const message: SkyPopoverMessage = { type };
    this.popoverController.next(message);
  }
}
