import { Component } from '@angular/core';

@Component({
  selector: 'app-summary-action-bar-demo',
  templateUrl: './summary-action-bar-demo.component.html',
  styleUrls: ['./summary-action-bar-demo.component.scss'],
})
export class SummaryActionBarDemoComponent {
  public onPrimaryActionClick(): void {
    alert('Primary action button clicked.');
  }

  public onSecondaryActionClick(): void {
    alert('Secondary action button clicked.');
  }

  public onSecondaryAction2Click(): void {
    alert('Secondary action 2 button clicked.');
  }
}
