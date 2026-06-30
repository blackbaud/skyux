import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyErrorModule } from '@skyux/errors';

/**
 * @title Embed error within the page markup
 */
@Component({
  selector: 'app-errors-error-embedded-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyErrorModule],
})
export class ErrorsErrorEmbeddedExampleComponent {
  protected customAction(): void {
    alert('action clicked!');
  }
}
