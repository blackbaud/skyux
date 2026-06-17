import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyKeyInfoLayoutType } from '@skyux/indicators';

@Component({
  selector: 'sky-test-key-info',
  templateUrl: './key-info-harness-test.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class KeyInfoHarnessTestComponent {
  public horizontalLayout: SkyKeyInfoLayoutType = 'horizontal';
}
