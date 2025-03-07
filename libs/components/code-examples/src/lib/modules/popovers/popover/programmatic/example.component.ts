import { Component } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import {
  SkyPopoverMessage,
  SkyPopoverMessageType,
  SkyPopoverModule,
} from '@skyux/popovers';

import { Subject } from 'rxjs';

/**
 * @title Popover with programmatic interactions
 */
@Component({
  selector: 'app-popovers-popover-programmatic-example',
  templateUrl: './example.component.html',
  imports: [SkyHelpInlineModule, SkyPopoverModule],
})
export class PopoversPopoverProgrammaticExampleComponent {
  protected popoverController = new Subject<SkyPopoverMessage>();

  #popoverOpen = false;

  protected onPopoverStateChange(isOpen: boolean): void {
    this.#popoverOpen = isOpen;
  }

  protected openPopover(): void {
    if (!this.#popoverOpen) {
      this.#sendMessage(SkyPopoverMessageType.Open);
    }
  }

  #sendMessage(type: SkyPopoverMessageType): void {
    const message: SkyPopoverMessage = { type };
    this.popoverController.next(message);
  }
}
