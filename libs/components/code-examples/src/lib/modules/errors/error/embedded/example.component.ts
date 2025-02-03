import { Component } from '@angular/core';
import { SkyErrorModule } from '@skyux/errors';

@Component({
  selector: 'app-errors-error-embedded-example',
  templateUrl: './example.component.html',
  imports: [SkyErrorModule],
})
export class ErrorsErrorEmbeddedExampleComponent {
  protected customAction(): void {
    alert('action clicked!');
  }
}
