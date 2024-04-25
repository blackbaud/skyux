import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import {
  SkyFieldGroupModule,
  SkyInputBoxModule,
  SkyToggleSwitchModule,
} from '@skyux/forms';

@Component({
  selector: 'app-field-group',
  templateUrl: './field-group.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyFieldGroupModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyToggleSwitchModule,
  ],
})
export class FieldGroupComponent {
  public formGroup: FormGroup;

  #formBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.#formBuilder.group({
      name: new FormControl(undefined),
      hometown: new FormControl(undefined),
      toggle: new FormControl(false),
    });
  }
}
