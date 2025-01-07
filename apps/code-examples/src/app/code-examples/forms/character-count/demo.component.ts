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

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyCharacterCounterModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyStatusIndicatorModule,
  ],
})
export class DemoComponent {
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
