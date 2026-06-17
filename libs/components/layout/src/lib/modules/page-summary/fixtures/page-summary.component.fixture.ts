import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  templateUrl: './page-summary.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyPageSummaryTestComponent {
  public showKeyInfo = true;
}
