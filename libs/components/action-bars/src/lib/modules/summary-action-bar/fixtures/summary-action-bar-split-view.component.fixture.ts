import { Component, input } from '@angular/core';

@Component({
  selector: 'sky-summary-action-bar-split-view-test',
  templateUrl: './summary-action-bar-split-view.component.fixture.html',
  standalone: false,
})
export class SkySummaryActionBarSplitViewTestComponent {
  public showBar = input<boolean>(true);
}
