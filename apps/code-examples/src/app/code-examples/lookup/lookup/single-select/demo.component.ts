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
} from '@skyux/lookup';

import { Person } from './person';

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss'],
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
    favoriteName: FormControl<Person[] | null>;
  }>;

  protected searchFilters: SkyAutocompleteSearchFunctionFilter[];

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

  protected name: Person[] = [this.people[15]];

  constructor() {
    this.favoritesForm = inject(FormBuilder).group({
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

  protected onAddButtonClicked(): void {
    alert('Add button clicked!');
  }

  protected onSubmit(): void {
    alert('Form submitted with: ' + JSON.stringify(this.favoritesForm.value));
  }
}
