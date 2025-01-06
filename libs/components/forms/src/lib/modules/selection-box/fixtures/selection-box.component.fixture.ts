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
      icon: 'edit',
      iconType: 'skyux',
      header: 'Write an introduction',
      description:
        'A brief one paragraph introduction about your organization will help supporters identify with your cause',
    },
    {
      icon: 'calendar',
      iconType: 'skyux',
      header: 'Schedule a consultation',
      description: 'Get something on the calendar to engage your constituents!',
    },
    {
      icon: 'clock',
      iconType: 'skyux',
      header: 'Save time and effort',
      description: 'Encourage supporters to interact with your organization',
    },
  ];

  public radioArray: any = [
    {
      icon: 'edit',
      iconType: 'skyux',
      header: 'Red',
      name: 'red',
    },
    {
      icon: 'edit',
      iconType: 'skyux',
      header: 'Yellow',
      name: 'yellow',
    },
    {
      icon: 'edit',
      iconType: 'skyux',
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
