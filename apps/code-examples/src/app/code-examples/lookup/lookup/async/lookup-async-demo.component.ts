import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SkyAutocompleteSearchAsyncArgs } from 'lookup';

import {
  SkyAutocompleteSearchAsyncResult,
  SkyAutocompleteSearchFunctionFilter,
} from 'projects/lookup/src/public-api';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-async-lookup-demo',
  templateUrl: './lookup-async-demo.component.html',
  styleUrls: ['./lookup-async-demo.component.scss'],
})
export class LookupAsyncDemoComponent implements OnInit {
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
    const name: any[] = this.myForm.controls.name.value;
    return [
      (searchText: string, item: any): boolean => {
        const found = name.find((option) => option.name === item.name);
        return !found;
      },
    ];
  }

  public onSubmit(): void {
    alert('Form submitted with: ' + JSON.stringify(this.myForm.value));
  }

  public searchAsync($event: SkyAutocompleteSearchAsyncArgs) {
    const result = new Subject<SkyAutocompleteSearchAsyncResult>();
    $event.result = result;
    setTimeout(() => {
      const searchText = $event.searchText.toLowerCase();
      const items = this.people.filter((person) => {
        return person.name.toLowerCase().includes(searchText)
      });
      result.next({
        hasMore: false,
        items,
        totalCount: items.length,
      });
    }, 800);
  }

  private createForm(): void {
    this.myForm = this.formBuilder.group({
      name: new FormControl(this.name),
    });
  }
}
