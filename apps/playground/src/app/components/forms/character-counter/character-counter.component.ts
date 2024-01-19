import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-character-counter',
  templateUrl: './character-counter.component.html',
})
export class CharacterCounterComponent {
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
