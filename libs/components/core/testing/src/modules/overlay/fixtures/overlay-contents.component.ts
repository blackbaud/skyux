import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'test-overlay-contents',
  templateUrl: './overlay-contents.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class OverlayContentsTestComponent {}
