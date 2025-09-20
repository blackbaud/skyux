import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyFieldGroupModule, SkyInputBoxModule } from '@skyux/forms';

@Component({
  selector: 'app-field-group',
  templateUrl: './field-group.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyFieldGroupModule,
    SkyInputBoxModule,
  ],
})
export class FieldGroupComponent {
  public formGroup: FormGroup;
  #formBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.#formBuilder.group({
      input: new FormControl(undefined),
    });
  }
}
