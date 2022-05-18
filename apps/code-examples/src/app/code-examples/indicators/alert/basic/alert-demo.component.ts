import { Component } from '@angular/core';

@Component({
  selector: 'app-alert-demo',
  templateUrl: './alert-demo.component.html',
})
export class AlertDemoComponent {
  public onClosedChange(event: boolean): void {
    alert(`Alert closed with: ${event}`);
  }
}
