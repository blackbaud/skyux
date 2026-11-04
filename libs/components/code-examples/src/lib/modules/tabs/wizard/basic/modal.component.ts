import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SkyButton, SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { SkyPhoneFieldModule } from '@skyux/phone-field';
import { SkyTabIndex, SkyTabsModule } from '@skyux/tabs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  imports: [
    ReactiveFormsModule,
    SkyButton,
    SkyCheckboxModule,
    SkyFluidGridModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyPhoneFieldModule,
    SkyTabsModule,
  ],
})
export class ModalComponent {
  protected activeIndex: SkyTabIndex = 0;
  protected title = 'New Member Sign-up';

  readonly #instance = inject(SkyModalInstance);

  public formGroup = inject(FormBuilder).group({
    firstName: new FormControl('', Validators.required),
    middleName: new FormControl(''),
    lastName: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    termsAccepted: new FormControl(false),
    mailingList: new FormControl(false),
  });

  readonly #formValue = toSignal(this.formGroup.valueChanges, {
    initialValue: this.formGroup.value,
  });

  protected readonly isStep2Disabled = computed(() => {
    const { firstName, lastName } = this.#formValue();

    return !(firstName && lastName);
  });

  protected readonly isStep3Disabled = computed(() => {
    const { phoneNumber, email } = this.#formValue();

    // Validity is not part of the form value, but the form updates it before
    // emitting the value change that recomputes this signal.
    return !(phoneNumber && this.formGroup.controls.phoneNumber.valid && email);
  });

  protected readonly isSaveDisabled = computed(
    () => !this.#formValue().termsAccepted,
  );

  protected onCancelClick(): void {
    this.#instance.cancel();
  }

  protected onSave(): void {
    this.#instance.save();
  }
}
