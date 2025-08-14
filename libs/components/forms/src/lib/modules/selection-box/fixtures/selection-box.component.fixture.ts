import { Component } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './selection-box.component.fixture.html',
  standalone: false,
})
export class SelectionBoxTestComponent {
  public myForm: UntypedFormGroup;

  public selectionBoxFormArray: UntypedFormArray;

  public checkboxSelectionBoxes: any[] = [
    {
      iconName: 'edit',
      header: 'Write an introduction',
      description:
        'A brief one paragraph introduction about your organization will help supporters identify with your cause',
    },
    {
      iconName: 'calendar-ltr',
      header: 'Schedule a consultation',
      description: 'Get something on the calendar to engage your constituents!',
    },
    {
      iconName: 'clock',
      header: 'Save time and effort',
      description: 'Encourage supporters to interact with your organization',
    },
  ];

  public radioArray: any = [
    {
      iconName: 'edit',
      header: 'Red',
      name: 'red',
    },
    {
      iconName: 'edit',
      header: 'Yellow',
      name: 'yellow',
    },
    {
      iconName: 'edit',
      header: 'Blue',
      name: 'blue',
    },
  ];

  #formBuilder: UntypedFormBuilder;

  constructor(formBuilder: UntypedFormBuilder) {
    this.#formBuilder = formBuilder;
    this.selectionBoxFormArray = this.#buildCheckboxes();
    this.myForm = this.#formBuilder.group({
      checkboxes: this.selectionBoxFormArray,
    });
  }

  #buildCheckboxes(): UntypedFormArray {
    const checkboxItemControls = this.checkboxSelectionBoxes.map(
      (aCheckboxSelectionBox) => {
        return this.#formBuilder.control(aCheckboxSelectionBox.undefinedValue);
      },
    );
    return this.#formBuilder.array(checkboxItemControls);
  }
}
