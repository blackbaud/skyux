import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SkyButton, SkyInputBoxModule } from '@skyux/forms';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

@Component({
  templateUrl: './modal.html',
  imports: [ReactiveFormsModule, SkyButton, SkyInputBoxModule, SkyModalModule],
})
export class FormsButtonInModalExampleModal {
  protected readonly instance = inject(SkyModalInstance);

  protected readonly userForm = new FormGroup({
    userName: new FormControl('', Validators.required),
  });

  protected saveUser(): void {
    this.userForm.markAllAsTouched();

    if (this.userForm.valid) {
      this.instance.save(this.userForm.value);
    }
  }
}
