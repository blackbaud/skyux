import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'sky-behavior-demo',
  templateUrl: './behavior-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsBehaviorDemoComponent {
}
