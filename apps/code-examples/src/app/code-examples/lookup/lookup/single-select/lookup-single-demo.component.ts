import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { SkyAutocompleteSearchFunctionFilter } from '@skyux/lookup';

import { LookupDemoPerson } from './lookup-demo-person';

@Component({
  selector: 'app-single-select-lookup-demo',
  templateUrl: './lookup-single-demo.component.html',
  styleUrls: ['./lookup-single-demo.component.scss'],
})
export class LookupSingleSelectDemoComponent implements OnInit {
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

  public name: LookupDemoPerson[] = [this.people[15]];

  constructor(private formBuilder: UntypedFormBuilder) {}

  public ngOnInit(): void {
    this.createForm();

    // If you need to execute some logic after the lookup values change,
    // subscribe to Angular's built-in value changes observable.
    this.myForm.valueChanges.subscribe((changes) => {
      console.log('Lookup value changes:', changes);
    });
  }

  // Only show people in the search results that have not been chosen already.
  public getSearchFilters(): SkyAutocompleteSearchFunctionFilter[] {
    const name: LookupDemoPerson[] = this.myForm.controls.name.value;
    return [
      (searchText: string, item: LookupDemoPerson): boolean => {
        const found = name.find((option) => option.name === item.name);
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
      name: new UntypedFormControl(this.name),
    });
  }
}
