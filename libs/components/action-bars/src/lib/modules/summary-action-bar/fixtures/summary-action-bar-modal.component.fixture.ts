import { Component, ViewChild } from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';

import { SkySummaryActionBarComponent } from '../summary-action-bar.component';

@Component({
  selector: 'sky-test-cmp-modal',
  templateUrl: './summary-action-bar-modal.component.fixture.html',
})
export class SkySummaryActionBarModalTestComponent {
  @ViewChild(SkySummaryActionBarComponent)
  public summaryActionBar: SkySummaryActionBarComponent;

  constructor(public instance: SkyModalInstance) {}
}
