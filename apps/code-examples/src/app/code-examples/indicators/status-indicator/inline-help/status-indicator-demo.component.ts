import { Component } from '@angular/core';

@Component({
  selector: 'app-status-indicator-demo',
  templateUrl: './status-indicator-demo.component.html',
})
export class StatusIndicatorDemoComponent {
  public onActionClick(): void {
    alert('Help inline button clicked!');
  }
}
