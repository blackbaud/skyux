import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import {
  SkyAutocompleteModule,
  SkyAutocompleteSearchFunctionFilter,
} from '@skyux/lookup';

@Component({
  selector: 'app-lookup-autocomplete-search-filters-example',
  templateUrl: './example.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyAutocompleteModule,
    SkyIdModule,
  ],
})
export class LookupAutocompleteSearchFiltersExampleComponent {
  protected colors: { name: string }[] = [
    { name: 'Red' },
    { name: 'Blue' },
    { name: 'Green' },
    { name: 'Orange' },
    { name: 'Pink' },
    { name: 'Purple' },
    { name: 'Yellow' },
    { name: 'Brown' },
    { name: 'Turquoise' },
    { name: 'White' },
    { name: 'Black' },
  ];

  protected formGroup: FormGroup;

  protected searchFilters: SkyAutocompleteSearchFunctionFilter[] = [
    (searchText: string, item: { name: string }): boolean => {
      return item.name !== 'Red';
    },
  ];

  constructor() {
    this.formGroup = inject(FormBuilder).group({
      favoriteColor: undefined,
    });
  }
}
