import { Component, inject, signal } from '@angular/core';
import { SkyInputBoxButton, SkyInputBoxModule } from '@skyux/forms';
import { FormsInputBoxNumberGenerator } from './number-generator';

/**
 * @title Input box with custom button
 */
@Component({
  selector: 'app-forms-input-box-custom-button-example',
  templateUrl: './example.html',
  imports: [SkyInputBoxButton, SkyInputBoxModule],
})
export class FormsInputBoxWithCustomButtonExample {
  readonly #generator = inject(FormsInputBoxNumberGenerator);

  protected readonly randomNumber = signal(this.#generator.generate());

  protected regenerate(): void {
    this.randomNumber.set(this.#generator.generate());
  }
}
