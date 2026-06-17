import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-responsive-content',
  templateUrl: './responsive-content.component.html',
  styleUrls: ['./responsive-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ResponsiveContentComponent {}
