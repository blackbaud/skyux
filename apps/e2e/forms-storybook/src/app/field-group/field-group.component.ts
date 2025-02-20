import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyFieldGroupModule, SkyInputBoxModule } from '@skyux/forms';
import { FontLoadingService } from '@skyux/storybook';

@Component({
  selector: 'app-field-group',
  templateUrl: './field-group.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyFieldGroupModule,
    SkyInputBoxModule,
  ],
})
export class FieldGroupComponent {
  public formGroup: FormGroup;
  protected ready = toSignal(inject(FontLoadingService).ready(true));

  #formBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.#formBuilder.group({
      input: new FormControl(undefined),
    });
  }
}
