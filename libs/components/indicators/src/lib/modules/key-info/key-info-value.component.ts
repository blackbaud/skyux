import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Specifies a value to display in larger, bold text.
 * @required
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-key-info-value',
  styleUrl: './key-info-value.component.scss',
  template: '<ng-content />',
})
export class SkyKeyInfoValueComponent {}
