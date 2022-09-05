import { Component, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './selection-box.component.fixture.html',
})
export class SelectionBoxTestComponent implements OnInit {
  public myForm: UntypedFormGroup;

  public get selectionBoxFormArray(): UntypedFormArray {
    return this.myForm.get('checkboxes') as UntypedFormArray;
  }

  public checkboxSelectionBoxes: any[] = [
    {
      icon: 'edit',
      iconType: 'skyux',
      header: 'Write an introduction',
      description:
        'A brief one paragraph introduction about your organzation will help supporters identify with your cause',
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

  constructor(private formBuilder: UntypedFormBuilder) {}

  public ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      checkboxes: this.buildCheckboxes(),
    });
  }

  private buildCheckboxes(): UntypedFormArray {
    const checkboxItemControls = this.checkboxSelectionBoxes.map(
      (aCheckboxSelectionBox) => {
        return this.formBuilder.control(aCheckboxSelectionBox.undefinedValue);
      }
    );
    return this.formBuilder.array(checkboxItemControls);
  }
}
