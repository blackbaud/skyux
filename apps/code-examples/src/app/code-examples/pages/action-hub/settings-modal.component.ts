import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyColorpickerModule } from '@skyux/colorpicker';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { MODAL_TITLE } from './modal-title-token';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyColorpickerModule,
    SkyInputBoxModule,
    SkyModalModule,
  ],
})
export class SettingsModalComponent {
  protected formGroup: FormGroup;
  protected fields: string[] = [];

  protected readonly modalInstance = inject(SkyModalInstance);
  protected readonly title = inject(MODAL_TITLE);
  readonly #formBuilder = inject(FormBuilder);

  constructor() {
    const controls: Record<string, AbstractControl> = {};

    for (let i = 1; i <= 5; i++) {
      const field = `${this.title} ${i}`;
      this.fields.push(field);
      controls[field] = this.#formBuilder.control('');
    }

    this.formGroup = this.#formBuilder.group(controls);

    this.modalInstance.closed.subscribe((args) => {
      if (args.reason === 'save') {
        console.log(this.formGroup.value);
      }
    });
  }
}
