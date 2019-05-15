import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'sky-demo-page-summary',
  templateUrl: './demo-page-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDemoPageSummaryComponent { }
