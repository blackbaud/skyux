import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyDatepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyDatepickerModule,
    SkyInputBoxModule,
  ],
})
export class DemoComponent {
  protected formGroup: FormGroup;

  readonly #formBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.#formBuilder.group({
      myDate: new FormControl(new Date(1999, 10, 5)),
    });
  }
}
