import { Component, ViewChild } from '@angular/core';
import type { SkyModalInstance } from '@skyux/modals';

import { SkySummaryActionBarComponent } from '../summary-action-bar.component';

@Component({
  selector: 'sky-test-cmp-modal',
  templateUrl: './summary-action-bar-modal.component.fixture.html',
  standalone: false,
})
export class SkySummaryActionBarModalTestComponent {
  @ViewChild(SkySummaryActionBarComponent)
  public summaryActionBar: SkySummaryActionBarComponent | undefined;

  constructor(public instance: SkyModalInstance) {}
}
