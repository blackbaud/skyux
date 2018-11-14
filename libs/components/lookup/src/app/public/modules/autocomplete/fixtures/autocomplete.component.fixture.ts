import {
  Component,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  NgForm
} from '@angular/forms';

import {
  SkyAutocompleteComponent,
  SkyAutocompleteInputDirective,
  SkyAutocompleteSearchFunction,
  SkyAutocompleteSearchFunctionFilter,
  SkyAutocompleteSelectionChange
} from '../index';

@Component({
  selector: 'sky-autocomplete-test',
  templateUrl: './autocomplete.component.fixture.html'
})
export class SkyAutocompleteTestComponent {
  public data: any[] = [
    { name: 'Red', objectid: 'abc' },
    { name: 'Blue', objectid: 'def' },
    { name: 'Green', objectid: 'ghi' },
    { name: 'Orange', objectid: 'jkl' },
    { name: 'Pink', objectid: 'mno' },
    { name: 'Purple', objectid: 'pqr' },
    { name: 'Yellow', objectid: 'stu'},
    { name: 'Brown', objectid: 'vwx' },
    { name: 'Turquoise', objectid: 'yz0' },
    { name: 'White', objectid: '123' },
    { name: 'Black', objectid: '456' }
  ];

  public model: any = {
    favoriteColor: undefined
  };
  public debounceTime: number;
  public descriptorProperty: string;
  public propertiesToSearch: string[];
  public search: SkyAutocompleteSearchFunction;
  public searchFilters: SkyAutocompleteSearchFunctionFilter[];
  public searchResultsLimit: number;
  public searchResultTemplate: TemplateRef<any>;
  public searchTextMinimumCharacters: number;

  @ViewChild(SkyAutocompleteComponent)
  public autocomplete: SkyAutocompleteComponent;

  @ViewChild(SkyAutocompleteInputDirective)
  public autocompleteInput: SkyAutocompleteInputDirective;

  @ViewChild('myForm')
  public myForm: NgForm;

  @ViewChild('customSearchResultTemplate')
  public customSearchResultTemplate: TemplateRef<any>;

  public onSelectionChange(event: SkyAutocompleteSelectionChange): void { }
}
