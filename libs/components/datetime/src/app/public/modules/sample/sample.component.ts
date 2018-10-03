import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'sky-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkySampleComponent { }
