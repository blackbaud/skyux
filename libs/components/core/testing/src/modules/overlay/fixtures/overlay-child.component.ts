import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'test-overlay-child',
  templateUrl: './overlay-child.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class OverlayChildTestComponent {}
