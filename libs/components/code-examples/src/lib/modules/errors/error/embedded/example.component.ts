import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyErrorModule } from '@skyux/errors';
import { SkyButton } from '@skyux/forms';

/**
 * @title Embed error within the page markup
 */
@Component({
  selector: 'app-errors-error-embedded-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SkyButton, SkyErrorModule],
})
export class ErrorsErrorEmbeddedExampleComponent {
  protected customAction(): void {
    alert('action clicked!');
  }
}
