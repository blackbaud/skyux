import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LabelDemoComponent {}
