import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

/**
 * @title Icon with basic setup
 */
@Component({
  selector: 'app-icon-basic-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyIconModule],
})
export class IconBasicExampleComponent {}
