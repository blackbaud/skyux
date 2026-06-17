import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { SkyModalInstance } from '@skyux/modals';

import { SkySummaryActionBarComponent } from '../summary-action-bar.component';

@Component({
  selector: 'sky-test-cmp-modal',
  templateUrl: './summary-action-bar-modal.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkySummaryActionBarModalTestComponent {
  @ViewChild(SkySummaryActionBarComponent)
  public summaryActionBar: SkySummaryActionBarComponent | undefined;

  public readonly instance = inject(SkyModalInstance);
}
