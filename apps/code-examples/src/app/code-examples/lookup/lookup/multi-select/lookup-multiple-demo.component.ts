import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SkyAutocompleteSearchFunctionFilter } from '@skyux/lookup';

import { LookupDemoPerson } from './lookup-demo-person';

@Component({
  selector: 'app-lookup-demo',
  templateUrl: './lookup-multiple-demo.component.html',
  styleUrls: ['./lookup-multiple-demo.component.scss'],
})
export class LookupMultipleSelectDemoComponent implements OnInit {
  public favoritesForm: FormGroup<{
    favoriteNames: FormControl<LookupDemoPerson[] | null>;
  }>;

  public searchFilters: SkyAutocompleteSearchFunctionFilter[] = [];

  /* spell-checker:disable */
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
  /* spell-checker:enable */

  constructor(formBuilder: FormBuilder) {
    this.favoritesForm = formBuilder.group({
      favoriteNames: [[this.people[15]]],
    });
  }

  public ngOnInit(): void {
    // If you need to execute some logic after the lookup values change,
    // subscribe to Angular's built-in value changes observable.
    this.favoritesForm.valueChanges.subscribe((changes) => {
      console.log('Lookup value changes:', changes);
    });

    this.searchFilters = [
      (_, item, args): boolean => {
        // When in the modal view, show all people in the search results, regardless if they have been chosen already.
        if (args?.context === 'modal') {
          return true;
        }

        const names = this.favoritesForm.value.favoriteNames;

        // When in the popover view (or in any other view), show people in the search results that have not been chosen already.
        return !names?.some((option) => option.name === item.name);
      },
    ];
  }

  public onAddButtonClicked(): void {
    alert('Add button clicked!');
  }

  public onSubmit(): void {
    alert('Form submitted with: ' + JSON.stringify(this.favoritesForm.value));
  }
}
