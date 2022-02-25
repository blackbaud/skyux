import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { SkyAutocompleteSearchFunctionFilter } from 'projects/lookup/src/public-api';

@Component({
  selector: 'app-lookup-demo',
  templateUrl: './lookup-multiple-demo.component.html',
  styleUrls: ['./lookup-multiple-demo.component.scss'],
})
export class LookupMultipleSelectDemoComponent implements OnInit {
  public myForm: FormGroup;

  public people: any[] = [
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

  public names: any[] = [this.people[15]];

  constructor(private formBuilder: FormBuilder) {}

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
    const names: any[] = this.myForm.controls.names.value;
    return [
      (searchText: string, item: any): boolean => {
        const found = names.find((option) => option.name === item.name);
        return !found;
      },
    ];
  }

  public onSubmit(): void {
    alert('Form submitted with: ' + JSON.stringify(this.myForm.value));
  }

  private createForm(): void {
    this.myForm = this.formBuilder.group({
      names: new FormControl(this.names),
    });
  }
}
