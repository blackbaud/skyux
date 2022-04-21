import { AfterViewInit, Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-popover-demo',
  templateUrl: './popover-demo.component.html',
})
export class PopoverDemoComponent implements AfterViewInit {
  public popover: unknown;

  public popoverExists = false;

  @ViewChild('popoverRef', { static: false })
  public set popoverRef(value: unknown) {
    // Wait for popover to render before assigning to directive.
    setTimeout(() => {
      this.popover = value;
    });
  }

  public ngAfterViewInit(): void {
    // Simulate asynchronous creation of popover element.
    setTimeout(() => {
      this.popoverExists = true;
    }, 1000);
  }
}
