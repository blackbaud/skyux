import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-selection-box-demo',
  templateUrl: './selection-box-demo.component.html',
})
export class SelectionBoxDemoComponent implements OnInit {
  public checkboxArray: FormArray | undefined;

  public selectionBoxes: any[] = [
    {
      name: 'Save time and effort',
      icon: 'clock',
      description:
        'Automate mundane tasks and spend more time on the things that matter.',
    },
    {
      name: 'Boost engagement',
      icon: 'user',
      description: 'Encourage supporters to interact with your organization.',
    },
    {
      name: 'Build relationships',
      icon: 'users',
      description:
        'Connect to supporters on a personal level and maintain accurate data.',
    },
  ];

  public myForm: FormGroup;

  #formBuilder: FormBuilder;

  constructor(formBuilder: FormBuilder) {
    this.#formBuilder = formBuilder;
  }

  public ngOnInit(): void {
    this.checkboxArray = this.#buildCheckboxes();
    this.myForm = this.#formBuilder.group({
      checkboxes: this.checkboxArray,
    });

    this.myForm.valueChanges.subscribe((value) => console.log(value));
  }

  #buildCheckboxes(): FormArray {
    const checkboxArray = this.selectionBoxes.map((checkbox) => {
      return this.#formBuilder.control(checkbox.selected);
    });
    return this.#formBuilder.array(checkboxArray);
  }
}
