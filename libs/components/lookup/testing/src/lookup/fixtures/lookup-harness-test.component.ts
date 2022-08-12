import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
})
export class LookupHarnessTestComponent implements AfterViewInit {
  public myForm: FormGroup;

  public people: Person[] = [
    {
      name: 'Abed',
      formal: 'Mr. Nadir',
    },
    {
      name: 'Alex',
      formal: 'Mr. Osbourne',
    },
    {
      name: 'Ben',
      formal: 'Mr. Chang',
    },
    {
      name: 'Britta',
      formal: 'Ms. Perry',
    },
    {
      name: 'Buzz',
      formal: 'Mr. Hickey',
    },
    {
      name: 'Craig',
      formal: 'Mr. Pelton',
    },
    {
      name: 'Elroy',
      formal: 'Mr. Patashnik',
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
      formal: 'Mr. Koogler',
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

  @ViewChild('modalItemTemplate')
  public modalItemTempalte: TemplateRef<unknown> | undefined;

  constructor(formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      basic: new FormControl(),
      formalNames: new FormControl(),
      singleSelect: new FormControl(this.name),
      multiselect: new FormControl(this.names),
    });
  }

  public ngAfterViewInit(): void {
    this.showMoreConfig.nativePickerConfig!.itemTemplate =
      this.modalItemTempalte;
  }

  // Only show people in the search results that have not been chosen already.
  public getSearchFilters(): SkyAutocompleteSearchFunctionFilter[] {
    const name: any[] = this.myForm.get('singleSelect')?.value;
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

  public disableForm() {
    this.myForm.disable();
  }

  public onAddClick() {}
}
