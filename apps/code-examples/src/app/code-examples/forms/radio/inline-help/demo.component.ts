import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyRadioModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/indicators';

type Item = {
  disabled: boolean;
  name: string;
  value: string;
};

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyHelpInlineModule,
    SkyRadioModule,
  ],
})
export class DemoComponent {
  protected formGroup: FormGroup;

  protected options: Item[] = [
    { name: 'Option 1', value: '1', disabled: false },
    { name: 'Option 2', value: '2', disabled: false },
    { name: 'Option 3 is disabled', value: '3', disabled: true },
  ];

  readonly #formBuilder = inject(FormBuilder);

  constructor() {
    this.formGroup = this.#formBuilder.group({
      myOption: this.options[0].name,
    });
  }

  protected onActionClick(): void {
    alert('Help inline button clicked!');
  }
}
