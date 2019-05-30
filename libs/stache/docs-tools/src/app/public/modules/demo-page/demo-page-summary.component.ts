import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'sky-docs-demo-page-summary',
  templateUrl: './demo-page-summary.component.html',
  styleUrls: ['./demo-page-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsDemoPageSummaryComponent { }
