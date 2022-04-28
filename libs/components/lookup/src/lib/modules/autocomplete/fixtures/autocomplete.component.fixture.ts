import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subject, of } from 'rxjs';
import { delay, filter } from 'rxjs/operators';

import { SkyAutocompleteInputDirective } from '../autocomplete-input.directive';
import { SkyAutocompleteComponent } from '../autocomplete.component';
import { SkyAutocompleteMessage } from '../types/autocomplete-message';
import { SkyAutocompleteSearchAsyncArgs } from '../types/autocomplete-search-async-args';
import { SkyAutocompleteSearchFunction } from '../types/autocomplete-search-function';
import { SkyAutocompleteSearchFunctionFilter } from '../types/autocomplete-search-function-filter';
import { SkyAutocompleteSelectionChange } from '../types/autocomplete-selection-change';

@Component({
  selector: 'sky-autocomplete-fixture',
  templateUrl: './autocomplete.component.fixture.html',
})
export class SkyAutocompleteFixtureComponent {
  public autocompleteAttribute: string;

  public data: any[] = [
    { name: 'Red', objectid: 'abc' },
    { name: 'Blue', objectid: 'def' },
    { name: 'Green', objectid: 'ghi' },
    { name: 'Orange', objectid: 'jkl' },
    { name: 'Pink', objectid: 'mno' },
    { name: 'Purple', objectid: 'pqr' },
    { name: 'Yellow', objectid: 'stu' },
    { name: 'Brown', objectid: 'vwx' },
    { name: 'Turquoise', objectid: 'yz0' },
    { name: 'White', objectid: '123' },
    { name: 'Black', objectid: '456' },
  ];

  public model: any = {
    favoriteColor: undefined,
  };
  public customNoResultsMessage: string;
  public debounceTime: number;
  public descriptorProperty: string;
  public disabled = false;
  public enableShowMore = false;
  public hideInput = false;
  public propertiesToSearch: string[];
  public messageStream: Subject<SkyAutocompleteMessage>;
  public search: SkyAutocompleteSearchFunction;
  public searchFilters: SkyAutocompleteSearchFunctionFilter[];
  public searchResultsLimit: number;
  public searchResultTemplate: TemplateRef<unknown>;
  public searchTextMinimumCharacters: number;
  public selectionFromChangeEvent: SkyAutocompleteSelectionChange;
  public showAddButton = false;

  @ViewChild('asyncAutocomplete', {
    read: SkyAutocompleteComponent,
    static: true,
  })
  public asyncAutocomplete: SkyAutocompleteComponent;

  @ViewChild('standardAutocomplete', {
    read: SkyAutocompleteComponent,
    static: true,
  })
  public autocomplete: SkyAutocompleteComponent;

  @ViewChild(SkyAutocompleteInputDirective, {
    read: SkyAutocompleteInputDirective,
  })
  public autocompleteInput: SkyAutocompleteInputDirective;

  @ViewChild('myForm', {
    read: NgForm,
    static: true,
  })
  public myForm: NgForm;

  @ViewChild('asyncForm', {
    read: NgForm,
    static: true,
  })
  public asyncForm: NgForm;

  @ViewChild('customSearchResultTemplate', {
    read: TemplateRef,
    static: true,
  })
  public customSearchResultTemplate: TemplateRef<unknown>;

  public addButtonClicked(): void {
    return;
  }

  public searchAsync(args: SkyAutocompleteSearchAsyncArgs): void {
    const searchText = (args.searchText || '').toLowerCase();

    const filteredData = this.data.filter(
      (item) => item.name.toLowerCase().indexOf(searchText) >= 0
    );

    args.result = of({
      items: filteredData,
      totalCount: filteredData.length,
    }).pipe(delay(150));
  }

  public onSelectionChange(event: SkyAutocompleteSelectionChange): void {
    this.selectionFromChangeEvent = event;
  }

  public onShowMoreClick(): void {
    return;
  }
}
