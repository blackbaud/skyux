import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-flyout-standard',
  templateUrl: './flyout-standard.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FlyoutStandardComponent {}
