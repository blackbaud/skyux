import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SkyAutocompleteSearchFunctionFilter } from '@skyux/lookup';

import { LookupDemoPerson } from './lookup-demo-person';

@Component({
  selector: 'app-single-select-lookup-demo',
  templateUrl: './lookup-single-demo.component.html',
  styleUrls: ['./lookup-single-demo.component.scss'],
})
export class LookupSingleSelectDemoComponent implements OnInit {
  public favoritesForm: FormGroup<{
    favoriteName: FormControl<LookupDemoPerson[] | null>;
  }>;

  public searchFilters: SkyAutocompleteSearchFunctionFilter[];

  public people: LookupDemoPerson[] = [
    { name: 'Abed' },
    { name: 'Alex' },
    { name: 'Ben' },
    /* spell-checker:disable-next-line */
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

  constructor(formBuilder: FormBuilder) {
    this.favoritesForm = formBuilder.group({
      favoriteName: [[this.people[15]]],
    });

    this.searchFilters = [
      (_, item): boolean => {
        const names = this.favoritesForm.value.favoriteName;

        // Only show people in the search results that have not been chosen already.
        return !names?.some((option) => option.name === item.name);
      },
    ];
  }

  public ngOnInit(): void {
    // If you need to execute some logic after the lookup values change,
    // subscribe to Angular's built-in value changes observable.
    this.favoritesForm.valueChanges.subscribe((changes) => {
      console.log('Lookup value changes:', changes);
    });
  }

  public onAddButtonClicked(): void {
    alert('Add button clicked!');
  }

  public onSubmit(): void {
    alert('Form submitted with: ' + JSON.stringify(this.favoritesForm.value));
  }
}
