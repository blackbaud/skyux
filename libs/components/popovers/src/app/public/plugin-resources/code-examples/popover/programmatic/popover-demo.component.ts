import {
  Component
} from '@angular/core';

import {
  SkyPopoverMessage,
  SkyPopoverMessageType
} from '@skyux/popovers';

import {
  Subject
} from 'rxjs';

@Component({
  selector: 'app-popover-demo',
  templateUrl: './popover-demo.component.html'
})
export class PopoverDemoComponent {

  public popoverController = new Subject<SkyPopoverMessage>();

  public openPopover(): void {
    this.sendMessage(SkyPopoverMessageType.Open);
  }

  private sendMessage(type: SkyPopoverMessageType): void {
    const message: SkyPopoverMessage = { type };
    this.popoverController.next(message);
  }
}
