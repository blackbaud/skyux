import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-selection-box',
  templateUrl: './selection-box.component.html',
  styleUrls: ['./selection-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SelectionBoxComponent {
  public myForm: FormGroup;

  readonly #formBuilder = inject(FormBuilder);

  constructor() {
    this.myForm = this.#formBuilder.group({
      checkbox1: new FormControl(false),
      checkbox2: new FormControl(false),
      checkbox3: new FormControl({ value: false, disabled: true }),
      myOption: '',
    });
  }
}
