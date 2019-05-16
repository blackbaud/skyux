import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

@Component({
  selector: 'sky-docs-behavior-demo',
  templateUrl: './behavior-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDocsBehaviorDemoComponent {
}
