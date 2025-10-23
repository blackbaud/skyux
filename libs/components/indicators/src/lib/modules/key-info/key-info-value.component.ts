import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Specifies a value to display in larger, bold text.
 * @required
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-key-info-value',
  styleUrl: './key-info-value.component.scss',
  template: '<ng-content />',
  // Disable view encapsulation to reduce selector specificity, making it
  // possible for users to override styles with font classes.
  encapsulation: ViewEncapsulation.None,
})
export class SkyKeyInfoValueComponent {}
