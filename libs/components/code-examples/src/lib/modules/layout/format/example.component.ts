import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyFormatModule } from '@skyux/layout';

/**
 * @title Format service basic usage
 */
@Component({
  selector: 'app-layout-format-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyFormatModule],
})
export class LayoutFormatExampleComponent {}
