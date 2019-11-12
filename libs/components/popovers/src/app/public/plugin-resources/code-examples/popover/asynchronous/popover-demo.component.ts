import {
  AfterViewInit,
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyPopoverComponent
} from '@skyux/popovers';

@Component({
  selector: 'app-popover-demo',
  templateUrl: './popover-demo.component.html'
})
export class PopoverDemoComponent implements AfterViewInit {

  public asyncPopoverRef: SkyPopoverComponent;

  @ViewChild('asyncPopover')
  private asyncPopover: SkyPopoverComponent;

  public ngAfterViewInit(): void {
    // Simulate asynchronous retrieval.
    setTimeout(() => {
      this.asyncPopoverRef = this.asyncPopover;
    }, 1000);
  }
}
