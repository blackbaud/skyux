import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import {
  SkyColorpickerMessage,
  SkyColorpickerMessageType,
  SkyColorpickerModule,
  SkyColorpickerOutput,
} from '@skyux/colorpicker';

import { Subject } from 'rxjs';

interface DemoForm {
  favoriteColor: FormControl<SkyColorpickerOutput | string>;
}

function isColorpickerOutput(value: unknown): value is SkyColorpickerOutput {
  return !!(value && typeof value === 'object' && 'rgba' in value);
}

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyColorpickerModule],
})
export class DemoComponent {
  protected colorpickerController = new Subject<SkyColorpickerMessage>();
  protected favoriteColor: FormControl<SkyColorpickerOutput | string>;
  protected formGroup: FormGroup<DemoForm>;
  protected showResetButton = false;

  constructor() {
    this.favoriteColor = new FormControl('#f00', {
      nonNullable: true,
      validators: [
        (control): ValidationErrors | null => {
          return isColorpickerOutput(control.value) &&
            control.value.rgba.alpha < 0.8
            ? { opaque: true }
            : null;
        },
      ],
    });

    this.formGroup = inject(FormBuilder).group<DemoForm>({
      favoriteColor: this.favoriteColor,
    });
  }

  protected openColorpicker(): void {
    this.#sendMessage(SkyColorpickerMessageType.Open);
  }

  protected resetColorpicker(): void {
    this.#sendMessage(SkyColorpickerMessageType.Reset);
  }

  protected toggleResetButton(): void {
    this.#sendMessage(SkyColorpickerMessageType.ToggleResetButton);
  }

  #sendMessage(type: SkyColorpickerMessageType): void {
    this.colorpickerController.next({ type });
  }
}
