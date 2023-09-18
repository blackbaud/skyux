import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SkyTimepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyTimepickerModule,
  ],
})
export class DemoComponent {
  protected formGroup: FormGroup;

  get #timeControl(): FormControl {
    return this.formGroup.get('time') as FormControl;
  }

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      time: new FormControl('2:45', Validators.required),
    });
  }

  protected clearSelectedTime(): void {
    this.#timeControl.setValue(undefined);
  }
}
