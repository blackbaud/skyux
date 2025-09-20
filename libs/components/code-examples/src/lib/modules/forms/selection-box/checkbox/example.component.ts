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
import { SkyCheckboxModule, SkySelectionBoxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';

/**
 * @title Selection boxes with checkboxes
 */
@Component({
  selector: 'app-forms-selection-box-checkbox-example',
  templateUrl: './example.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyIconModule,
    SkyIdModule,
    SkySelectionBoxModule,
  ],
})
export class FormsSelectionBoxCheckboxExampleComponent {
  protected checkboxControls: FormControl[] | undefined;

  protected selectionBoxes: {
    description: string;
    iconName: string;
    name: string;
    selected?: boolean;
  }[] = [
    {
      name: 'Save time and effort',
      iconName: 'clock',
      description:
        'Automate mundane tasks and spend more time on the things that matter.',
    },
    {
      name: 'Boost engagement',
      iconName: 'person',
      description: 'Encourage supporters to interact with your organization.',
    },
    {
      name: 'Build relationships',
      iconName: 'people-team',
      description:
        'Connect to supporters on a personal level and maintain accurate data.',
    },
  ];

  protected formGroup: FormGroup;

  readonly #formBuilder = inject(FormBuilder);

  constructor() {
    const checkboxArray = this.#buildCheckboxes();
    this.checkboxControls = checkboxArray.controls as FormControl[];

    this.formGroup = this.#formBuilder.group({
      checkboxes: checkboxArray,
    });
  }

  #buildCheckboxes(): FormArray {
    const checkboxArray = this.selectionBoxes.map((checkbox) =>
      this.#formBuilder.control(checkbox.selected),
    );

    return this.#formBuilder.array(checkboxArray);
  }
}
