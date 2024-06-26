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
  standalone: true,
  template: `
    <form [formGroup]="demoForm" (submit)="saveForm()">
      <sky-modal [helpPopoverContent]="helpPopoverContent">
        <sky-modal-header> Modal title </sky-modal-header>
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

  protected helpPopoverContent =
    'Use the help inline component to invoke contextual user assistance.';

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
