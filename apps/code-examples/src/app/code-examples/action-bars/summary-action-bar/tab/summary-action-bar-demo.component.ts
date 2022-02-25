import { Component } from '@angular/core';

@Component({
  selector: 'app-summary-action-bar-demo',
  templateUrl: './summary-action-bar-demo.component.html',
  styleUrls: ['./summary-action-bar-demo.component.scss'],
})
export class SummaryActionBarDemoComponent {
  public onPrimaryActionClick(): void {
    console.log('Primary action button clicked.');
  }

  public onSecondaryActionClick(): void {
    console.log('Secondary action button clicked.');
  }

  public onSecondaryAction2Click(): void {
    console.log('Secondary action 2 button clicked.');
  }
}
