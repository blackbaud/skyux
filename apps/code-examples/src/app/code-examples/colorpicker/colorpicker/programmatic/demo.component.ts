import { Component, inject } from '@angular/core';
import {
  AbstractControl,
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
} from '@skyux/colorpicker';

import { Subject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [FormsModule, ReactiveFormsModule, SkyColorpickerModule],
})
export class DemoComponent {
  protected colorpickerController = new Subject<SkyColorpickerMessage>();
  protected favoriteColor: FormControl<string | null>;
  protected formGroup: FormGroup;
  protected showResetButton = false;

  constructor() {
    this.favoriteColor = new FormControl('#f00', [
      (control: AbstractControl): ValidationErrors | null => {
        if (control.value?.rgba?.alpha < 0.8) {
          return { opaque: true };
        }

        return null;
      },
    ]);

    this.formGroup = inject(FormBuilder).group({
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
    const message: SkyColorpickerMessage = { type };
    this.colorpickerController.next(message);
  }
}
