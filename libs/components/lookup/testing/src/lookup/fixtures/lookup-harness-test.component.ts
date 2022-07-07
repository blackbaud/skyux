import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  SkyAutocompleteSearchAsyncArgs,
  SkyAutocompleteSearchAsyncResult,
  SkyAutocompleteSearchFunctionFilter,
} from '@skyux/lookup';

import { Subject } from 'rxjs';

@Component({
  selector: 'test-lookup-1',
  templateUrl: './lookup-harness-test.component.html',
})
export class LookupHarnessTestComponent {
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

  public name: any[] = [this.people[15]];

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      name: new FormControl(this.name),
    });
  }

  // Only show people in the search results that have not been chosen already.
  public getSearchFilters(): SkyAutocompleteSearchFunctionFilter[] {
    const name: any[] = this.myForm.controls.name.value;
    return [
      (searchText: string, item: any): boolean => {
        const found = name.find((option) => option.name === item.name);
        return !found;
      },
    ];
  }

  public searchAsync($event: SkyAutocompleteSearchAsyncArgs) {
    const result = new Subject<SkyAutocompleteSearchAsyncResult>();
    $event.result = result;
    setTimeout(() => {
      const searchText = $event.searchText.toLowerCase();
      const items = this.people.filter((person) => {
        return person.name.toLowerCase().includes(searchText);
      });
      result.next({
        hasMore: false,
        items,
        totalCount: items.length,
      });
    }, 800);
  }
}
