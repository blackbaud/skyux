import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyFluidGridModule } from '@skyux/layout';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { SkyPhoneFieldModule } from '@skyux/phone-field';
import { SkyTabIndex, SkyTabsModule } from '@skyux/tabs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  imports: [
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyFluidGridModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyPhoneFieldModule,
    SkyTabsModule,
  ],
})
export class ModalComponent implements OnInit {
  protected activeIndex: SkyTabIndex = 0;
  public formGroup: FormGroup;
  protected isSaveDisabled = true;
  protected isStep2Disabled = true;
  protected isStep3Disabled = true;
  protected title = 'New Member Sign-up';

  readonly #instance = inject(SkyModalInstance);

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl(''),
      lastName: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      termsAccepted: new FormControl(false),
      mailingList: new FormControl(false),
    });
  }

  public ngOnInit(): void {
    this.formGroup.valueChanges.subscribe(() => {
      this.#checkRequirementsMet();
    });
  }

  protected onCancelClick(): void {
    this.#instance.cancel();
  }

  protected onSave(): void {
    this.#instance.save();
  }

  #checkRequirementsMet(): void {
    this.isStep2Disabled = !(
      this.formGroup?.get('firstName')?.value &&
      this.formGroup?.get('lastName')?.value
    );

    this.isStep3Disabled = !(
      this.formGroup?.get('phoneNumber')?.value &&
      this.formGroup?.get('phoneNumber')?.valid &&
      this.formGroup?.get('email')?.value
    );

    this.isSaveDisabled = !this.formGroup?.get('termsAccepted')?.value;
  }
}
