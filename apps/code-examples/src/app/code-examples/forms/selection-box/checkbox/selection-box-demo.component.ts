import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-selection-box-demo',
  templateUrl: './selection-box-demo.component.html',
})
export class SelectionBoxDemoComponent implements OnInit {
  public get checkboxArray(): FormArray {
    return this.myForm.get('checkboxes') as FormArray;
  }

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

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      checkboxes: this.buildCheckboxes(),
    });

    this.myForm.valueChanges.subscribe((value) => console.log(value));
  }

  private buildCheckboxes(): FormArray {
    const checkboxArray = this.selectionBoxes.map((checkbox) => {
      return this.formBuilder.control(checkbox.selected);
    });
    return this.formBuilder.array(checkboxArray);
  }
}
