import { Component } from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';

@Component({
  selector: 'app-test-cmp-modal',
  templateUrl: './summary-action-bar-modal-demo.component.html',
  styleUrls: ['./summary-action-bar-modal-demo.component.scss'],
})
export class SkySummaryActionBarModalDemoComponent {
  constructor(public instance: SkyModalInstance) {}

  public onSecondaryActionClick(): void {
    alert('Secondary action button clicked.');
  }

  public onSecondaryAction2Click(): void {
    alert('Secondary action 2 button clicked.');
  }
}
