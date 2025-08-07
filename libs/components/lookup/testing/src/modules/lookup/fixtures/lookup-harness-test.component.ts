import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  SkyAutocompleteSearchAsyncArgs,
  SkyAutocompleteSearchAsyncResult,
  SkyAutocompleteSearchFunctionFilter,
  SkyLookupShowMoreConfig,
} from '@skyux/lookup';

import { Subject } from 'rxjs';

interface Person {
  name: string;
  formal?: string;
}

@Component({
  selector: 'test-lookup-1',
  templateUrl: './lookup-harness-test.component.html',
  standalone: false,
})
export class LookupHarnessTestComponent {
  public myForm: UntypedFormGroup;

  public people: Person[] = [
    {
      name: 'Abed',
      formal: 'Mr. Nadir',
    },
    {
      name: 'Alex',
      formal: 'Mr. Osborne',
    },
    {
      name: 'Ben',
      formal: 'Mr. Chang',
    },
    {
      name: 'Brittany',
      formal: 'Ms. Perry',
    },
    {
      name: 'Buzz',
      formal: 'Mr. Hickey',
    },
    {
      name: 'Craig',
      formal: 'Mr. Pelt',
    },
    {
      name: 'Elroy',
      formal: 'Mr. Pata',
    },
    {
      name: 'Garrett',
      formal: 'Mr. Lambert',
    },
    {
      name: 'Ian',
      formal: 'Mr. Duncan',
    },
    {
      name: 'Jeff',
      formal: 'Mr. Winger',
    },
    {
      name: 'Leonard',
      formal: 'Mr. Rodriguez',
    },
    {
      name: 'Neil',
      formal: 'Mr. Neil',
    },
    {
      name: 'Pierce',
      formal: 'Mr. Hawthorne',
    },
    {
      name: 'Preston',
      formal: 'Mr. Cooper',
    },
    {
      name: 'Rachel',
      formal: 'Ms. Rachel',
    },
    {
      name: 'Shirley',
      formal: 'Ms. Bennett',
    },
    {
      name: 'Todd',
      formal: 'Mr. Jacobson',
    },
    {
      name: 'Troy',
      formal: 'Mr. Barnes',
    },
    {
      name: 'Vaughn',
      formal: 'Mr. Miller',
    },
    {
      name: 'Vicki',
      formal: 'Ms. Jenkins',
    },
  ];

  public name: Person[] = [this.people[15]];

  public names: Person[] = [this.people[15]];

  public showMoreConfig: SkyLookupShowMoreConfig = {
    nativePickerConfig: {},
  };

  @ViewChild('showMoreSearchResultTemplate')
  public showMoreSearchResultTemplate: TemplateRef<unknown> | undefined;

  constructor(formBuilder: UntypedFormBuilder) {
    this.myForm = formBuilder.group({
      basic: new UntypedFormControl(),
      formalNames: new UntypedFormControl(),
      singleSelect: new UntypedFormControl(this.name),
      multiselect: new UntypedFormControl(this.names),
      asyncNames: new UntypedFormControl(this.names),
    });
  }

  // Only show people in the search results that have not been chosen already.
  public getSearchFilters(): SkyAutocompleteSearchFunctionFilter[] {
    const name: { name: string }[] = this.myForm.get('singleSelect')?.value;
    return [
      (searchText: string, item: { name: string }): boolean => {
        const found = name.find((option) => option.name === item.name);
        return !found;
      },
    ];
  }

  public onSearchAsync(args: SkyAutocompleteSearchAsyncArgs): void {
    const result = new Subject<SkyAutocompleteSearchAsyncResult>();
    args.result = result;

    setTimeout(() => {
      const searchText = args.searchText.toLowerCase();

      // Simulate multiple results being sent after the "Load more" button is pressed.
      const clone = JSON.parse(JSON.stringify(this.people));
      const data: Person[] = clone.splice(args.offset);

      const items = data.filter((person) => {
        return person.name.toLowerCase().includes(searchText);
      });

      // We run the same tests for both the non-async and async pickers, so
      // make sure the number of results is limited to 10 so they match.
      items.splice(10);

      result.next({
        hasMore: true, // Show the "Load more" button.
        items,
        totalCount: items.length,
      });
    });
  }

  public disableForm(): void {
    this.myForm.disable();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public onAddClick(): void {}
}
