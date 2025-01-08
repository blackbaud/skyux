import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { ModalContext } from './modal-context';

@Component({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyModalModule,
  ],
  template: `
    <form [formGroup]="demoForm" (submit)="saveForm()">
      <sky-modal headingText="Modal title" helpKey="help.html">
        <sky-modal-content>
          <sky-input-box>
            <input formControlName="value1" type="text" />
          </sky-input-box>
        </sky-modal-content>
        <sky-modal-footer>
          <button class="sky-btn sky-btn-primary" type="submit">Save</button>
          <button
            class="sky-btn sky-btn-link"
            type="button"
            (click)="cancelForm()"
          >
            Cancel
          </button>
        </sky-modal-footer>
      </sky-modal>
    </form>
  `,
})
export class ModalComponent {
  protected demoForm: FormGroup<{
    value1: FormControl<string | null | undefined>;
  }>;

  readonly #context = inject(ModalContext);
  readonly #instance = inject(SkyModalInstance);

  constructor() {
    this.demoForm = inject(FormBuilder).group({
      value1: new FormControl(this.#context.data?.value1),
    });
  }

  protected cancelForm(): void {
    this.#instance.cancel();
  }

  protected saveForm(): void {
    this.#instance.save({});
  }
}
