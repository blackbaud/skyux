import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'sky-filter-summary',
  styleUrls: ['./filter-summary.component.scss'],
  templateUrl: './filter-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyFilterSummaryComponent { }
