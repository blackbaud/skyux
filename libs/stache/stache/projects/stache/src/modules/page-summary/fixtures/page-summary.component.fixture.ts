import {
  Component, Input
} from '@angular/core';

@Component({
  selector: 'stache-test-component',
  templateUrl: './page-summary.component.fixture.html'
})
export class StachePageSummaryTestComponent {
  @Input()
  public pageSummaryText: string;
}
