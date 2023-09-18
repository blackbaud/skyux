import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  SkyColorpickerMessage,
  SkyColorpickerMessageType,
  SkyColorpickerModule,
} from '@skyux/colorpicker';
import { SkyIdModule } from '@skyux/core';

import { Subject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyColorpickerModule,
    SkyIdModule,
  ],
})
export class DemoComponent {
  protected colorpickerController = new Subject<SkyColorpickerMessage>();
  protected formGroup: FormGroup;
  protected showResetButton = false;

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      favoriteColor: new FormControl('#f00'),
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
