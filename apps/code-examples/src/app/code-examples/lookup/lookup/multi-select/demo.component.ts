import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import {
  SkyAutocompleteSearchFunctionFilter,
  SkyLookupModule,
  SkyLookupShowMoreConfig,
} from '@skyux/lookup';

import { Person } from './person';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyLookupModule,
  ],
})
export class DemoComponent implements OnInit {
  public favoritesForm: FormGroup<{
    favoriteNames: FormControl<Person[] | null>;
  }>;

  public showMoreConfig: SkyLookupShowMoreConfig = {
    nativePickerConfig: {
      selectionDescriptor: 'names',
    },
  };

  protected searchFilters: SkyAutocompleteSearchFunctionFilter[] = [];

  protected people: Person[] = [
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

  constructor() {
    this.favoritesForm = inject(FormBuilder).group({
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

  protected onAddButtonClicked(): void {
    alert('Add button clicked!');
  }

  protected onSubmit(): void {
    alert('Form submitted with: ' + JSON.stringify(this.favoritesForm.value));
  }
}
