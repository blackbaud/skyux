import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'sky-sample-demo',
  templateUrl: './sample-demo.component.html',
  styleUrls: ['./sample-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkySampleDemoComponent { }
