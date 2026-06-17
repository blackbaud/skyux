import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-expansion-indicator',
  templateUrl: './expansion-indicator.component.html',
  styleUrls: ['./expansion-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ExpansionIndicatorComponent {}
