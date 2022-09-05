import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  SkyAutocompleteSearchArgs,
  SkyAutocompleteSearchFunctionFilter,
} from '@skyux/lookup';

import { LookupDemoPerson } from './lookup-demo-person';

@Component({
  selector: 'app-lookup-demo',
  templateUrl: './lookup-multiple-demo.component.html',
  styleUrls: ['./lookup-multiple-demo.component.scss'],
})
export class LookupMultipleSelectDemoComponent implements OnInit {
  public myForm: UntypedFormGroup;

  public people: LookupDemoPerson[] = [
    { name: 'Abed' },
    { name: 'Alex' },
    { name: 'Ben' },
    { name: 'Britta' },
    { name: 'Buzz' },
    { name: 'Craig' },
    { name: 'Elroy' },
    { name: 'Garrett' },
    { name: 'Ian' },
    { name: 'Jeff' },
    { name: 'Leonard' },
    { name: 'Neil' },
    { name: 'Pierce' },
    { name: 'Preston' },
    { name: 'Rachel' },
    { name: 'Shirley' },
    { name: 'Todd' },
    { name: 'Troy' },
    { name: 'Vaughn' },
    { name: 'Vicki' },
  ];

  public names: LookupDemoPerson[] = [this.people[15]];

  constructor(private formBuilder: UntypedFormBuilder) {}

  public ngOnInit(): void {
    this.createForm();

    // If you need to execute some logic after the lookup values change,
    // subscribe to Angular's built-in value changes observable.
    this.myForm.valueChanges.subscribe((changes) => {
      console.log('Lookup value changes:', changes);
    });
  }

  /**
   * When in the modal view, show all people in the search results, regardless if they have been chosen already.
   * When in the popover view (or in any other view), show people in the search results that have not been chosen already.
   */
  public getSearchFilters(): SkyAutocompleteSearchFunctionFilter[] {
    const names: LookupDemoPerson[] = this.myForm.controls.names.value;
    return [
      (
        searchText: string,
        item: any,
        args?: SkyAutocompleteSearchArgs
      ): boolean => {
        if (args?.context === 'modal') {
          return true;
        }

        const found = names.find((option) => option.name === item.name);
        return !found;
      },
    ];
  }

  public onAddButtonClicked(): void {
    alert('Add button clicked!');
  }

  public onSubmit(): void {
    alert('Form submitted with: ' + JSON.stringify(this.myForm.value));
  }

  private createForm(): void {
    this.myForm = this.formBuilder.group({
      names: new UntypedFormControl(this.names),
    });
  }
}
