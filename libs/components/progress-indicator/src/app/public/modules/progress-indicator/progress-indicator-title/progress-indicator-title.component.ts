import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'sky-progress-indicator-title',
  templateUrl: './progress-indicator-title.component.html',
  styleUrls: ['./progress-indicator-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyProgressIndicatorTitleComponent { }
