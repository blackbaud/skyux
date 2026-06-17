// #region imports
import { ChangeDetectionStrategy, Component } from '@angular/core';

// #endregion

@Component({
  selector: 'sky-test-cmp',
  template: 'noop',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyToasterTestComponent {}
