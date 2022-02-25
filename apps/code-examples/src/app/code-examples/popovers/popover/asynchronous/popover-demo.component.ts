import { AfterViewInit, Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-popover-demo',
  templateUrl: './popover-demo.component.html',
})
export class PopoverDemoComponent implements AfterViewInit {
  public asyncPopoverRef: any;

  @ViewChild('asyncPopover')
  private asyncPopover: any;

  public ngAfterViewInit(): void {
    // Simulate asynchronous retrieval.
    setTimeout(() => {
      this.asyncPopoverRef = this.asyncPopover;
    }, 1000);
  }
}
