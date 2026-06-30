import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyIdModule } from '@skyux/core';

/**
 * @title Basic example
 */
@Component({
  selector: 'app-core-id-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyIdModule],
})
export class CoreIdExampleComponent {}
