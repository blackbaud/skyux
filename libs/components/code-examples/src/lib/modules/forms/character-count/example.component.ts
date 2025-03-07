import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyCharacterCounterModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

/**
 * @title Character count with basic setup
 */
@Component({
  selector: 'app-forms-character-count-example',
  templateUrl: './example.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyCharacterCounterModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyStatusIndicatorModule,
  ],
})
export class FormsCharacterCountExampleComponent {
  protected description: FormControl;
  protected formGroup: FormGroup;
  protected maxDescriptionCharacterCount = 50;

  readonly #formBuilder = inject(FormBuilder);

  constructor() {
    this.description = this.#formBuilder.control(
      'Boys and Girls Club of South Carolina donation',
    );

    this.formGroup = this.#formBuilder.group({
      description: this.description,
    });
  }
}
