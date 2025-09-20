import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import {
  SkyCheckboxModule,
  SkyRadioModule,
  SkySelectionBoxModule,
} from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';

@Component({
  selector: 'app-selection-box',
  templateUrl: './selection-box.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyIconModule,
    SkyIdModule,
    SkyRadioModule,
    SkySelectionBoxModule,
  ],
})
export class SelectionBoxComponent {
  protected checkboxControls: FormControl[] | undefined;

  protected selectionBoxes: {
    description: string;
    icon: string;
    name: string;
    value: string;
    selected?: boolean;
    disabled?: boolean;
  }[] = [
    {
      name: 'Save time and effort',
      icon: 'clock',
      description:
        'Automate mundane tasks and spend more time on the things that matter.',
      value: 'clock',
      selected: true,
    },
    {
      name: 'Boost engagement',
      icon: 'person',
      description: 'Encourage supporters to interact with your organization.',
      value: 'engagement',
    },
    {
      name: 'Build relationships',
      icon: 'people-team',
      description:
        'Connect to supporters on a personal level and maintain accurate data.',
      value: 'relationships',
      disabled: true,
    },
  ];

  protected formGroup: FormGroup;

  readonly #formBuilder = inject(FormBuilder);

  constructor() {
    const checkboxArray = this.#buildCheckboxes();
    this.checkboxControls = checkboxArray.controls as FormControl[];

    this.formGroup = this.#formBuilder.group({
      checkboxes: checkboxArray,
      radio: this.selectionBoxes[1]['value'],
    });
  }

  #buildCheckboxes(): FormArray {
    const checkboxArray = this.selectionBoxes.map((checkbox) => {
      const control = this.#formBuilder.control(checkbox.selected);
      if (checkbox.disabled) {
        control.disable();
      }
      return control;
    });

    return this.#formBuilder.array(checkboxArray);
  }
}
