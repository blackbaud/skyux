import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-responsive',
  templateUrl: './responsive.component.html',
  styleUrls: ['./responsive.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponsiveComponent {
  public readonly containerBreakpoints = ['xs', 'sm', 'md', 'lg'];
}
