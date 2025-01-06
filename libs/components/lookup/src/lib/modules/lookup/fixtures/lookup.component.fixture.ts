import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { SkyAutocompleteSearchAsyncArgs } from '../../autocomplete/types/autocomplete-search-async-args';
import { SkyAutocompleteSearchFunction } from '../../autocomplete/types/autocomplete-search-function';
import { SkyAutocompleteSearchFunctionFilter } from '../../autocomplete/types/autocomplete-search-function-filter';
import { SkyLookupComponent } from '../lookup.component';
import { SkyLookupAddCallbackArgs } from '../types/lookup-add-click-callback-args';
import { SkyLookupAddClickEventArgs } from '../types/lookup-add-click-event-args';
import { SkyLookupSelectModeType } from '../types/lookup-select-mode-type';
import { SkyLookupShowMoreConfig } from '../types/lookup-show-more-config';
import { SkyLookupShowMoreCustomPickerContext } from '../types/lookup-show-more-custom-picker-context';
import { SkyLookupShowMoreNativePickerConfig } from '../types/lookup-show-more-native-picker-config';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './lookup.component.fixture.html',
  standalone: false,
})
export class SkyLookupTestComponent {
  @ViewChild('asyncLookup', {
    read: SkyLookupComponent,
    static: true,
  })
  public asyncLookupComponent!: SkyLookupComponent;

  @ViewChild('standardLookup', {
    read: SkyLookupComponent,
    static: true,
  })
  public lookupComponent!: SkyLookupComponent;

  @ViewChild('customSearchResultTemplate')
  public searchResultTemplate!: TemplateRef<unknown>;

  @ViewChild('customShowMoreTemplate')
  public showMoreTemplate!: TemplateRef<unknown>;

  public ariaLabel: string | undefined;

  public ariaLabelledBy: string | undefined;

  public asyncForm: UntypedFormGroup;

  public autocompleteAttribute: string | undefined;

  public customSearch: SkyAutocompleteSearchFunction | undefined;

  public customSearchFilters: SkyAutocompleteSearchFunctionFilter[] | undefined;

  public data: any[] | undefined = [];

  public descriptorProperty: string | undefined;

  public enabledSearchResultTemplate: TemplateRef<unknown> | undefined;

  public enableShowMore: boolean | undefined = false;

  public form: UntypedFormGroup;

  public idProperty: string | undefined = 'name';

  public ignoreAddDataUpdate = false;

  public placeholderText: string | undefined;

  public propertiesToSearch: string[] | undefined;

  public selectMode: SkyLookupSelectModeType | undefined;

  public showAddButton: boolean | undefined = false;

  public showMoreConfig: SkyLookupShowMoreConfig | undefined = {};

  public wrapperClass: string | undefined;

  public get friends(): any[] {
    return this.#_friends;
  }

  public set friends(value: any[]) {
    this.#_friends = value;

    if (this.form?.controls['friends']) {
      this.form.controls['friends'].setValue(value);
    }
    if (this.asyncForm?.controls['friends']) {
      this.asyncForm.controls['friends'].setValue(value);
    }
  }

  #_friends: any[] = [];

  constructor(formBuilder: UntypedFormBuilder) {
    this.data = [
      {
        name: 'Andy',
        description: 'Mr. Andy',
        birthDate: '1/1/1995',
      },
      { name: 'Beth', description: 'Mrs. Beth' },
      { name: 'Dan', description: 'Mr. Dan' },
      { name: 'David', description: 'Mr. David' },
      { name: 'Frank', description: 'Mr. Frank' },
      { name: 'Fred', description: 'Mr. Fred' },
      { name: 'Isaac', description: 'Mr. Isaac' },
      { name: 'John', description: 'Mr. John' },
      { name: 'Joyce', description: 'Mrs. Joyce' },
      { name: 'Lindsey', description: 'Mrs. Lindsey' },
      { name: 'Mitch', description: 'Mr. Mitch' },
      { name: 'Oliver', description: 'Mr. Oliver' },
      {
        name: 'Patty',
        description: 'Ms. Patty',
        birthDate: '1/1/1996',
      },
      {
        name: 'Paul',
        description: 'Mr. Paul',
        birthDate: '11/1997',
      },
      { name: 'Sally', description: 'Ms. Sally' },
      { name: 'Susan', description: 'Ms. Susan' },
      { name: 'Vanessa', description: 'Mrs. Vanessa' },
      { name: 'Vin', description: 'Mr. Vin' },
      { name: 'Xavier', description: 'Mr. Xavier' },
      { name: 'Yolanda', description: 'Ms. Yolanda' },
      { name: 'Zack', description: 'Mr. Zack' },
    ];

    this.asyncForm = formBuilder.group({
      friends: new UntypedFormControl(this.friends),
    });
    this.form = formBuilder.group({
      friends: new UntypedFormControl(this.friends),
    });
  }

  public addButtonClicked(
    addButtonClickArgs: SkyLookupAddClickEventArgs,
  ): void {
    const newItem = { name: 'New item' };
    const newItems = [newItem].concat(this.data ?? []);
    const callbackArgs: SkyLookupAddCallbackArgs = {
      item: newItem,
      data: this.ignoreAddDataUpdate ? undefined : newItems,
    };

    // Add the new item to the original data source so it will be returned in
    // subsequent async searches.
    this.data = [newItem, ...(this.data || [])];

    addButtonClickArgs.itemAdded(callbackArgs);
  }

  public enableCustomPicker(): void {
    if (this.showMoreConfig) {
      this.showMoreConfig.customPicker = {
        open: (context: SkyLookupShowMoreCustomPickerContext) => {
          return;
        },
      };
    }
  }

  public enableLookup(): void {
    this.asyncForm.controls['friends'].enable();
    this.form.controls['friends'].enable();
  }

  public enableSearchResultTemplate(): void {
    this.enabledSearchResultTemplate = this.searchResultTemplate;
  }

  public disableLookup(): void {
    this.asyncForm.controls['friends'].disable();
    this.form.controls['friends'].disable();
  }

  public resetForm(): void {
    this.asyncForm.reset();
    this.form.reset();
  }

  public searchAsync(args: SkyAutocompleteSearchAsyncArgs): void {
    const searchText = (args.searchText || '').toLowerCase();

    let items = this.data
      ? this.data.filter(
          (item) => item.name.toLowerCase().indexOf(searchText) >= 0,
        )
      : [];

    const totalCount = items.length;
    let hasMore = false;
    const itemCountToReturn = args.displayType === 'popover' ? 5 : 10;

    items = items.slice(args.offset, args.offset + itemCountToReturn);
    hasMore = args.offset + itemCountToReturn < totalCount;

    // Simulate new object instances being returned by a web service call.
    items = items.map((item) => Object.assign({}, item));

    args.result = of({
      hasMore,
      items,
      totalCount,
    }).pipe(delay(150));
  }

  public setMultiSelect(): void {
    this.selectMode = 'multiple';
  }

  public setRequired(): void {
    this.asyncForm.controls['friends'].setValidators([Validators.required]);
    this.form.controls['friends'].setValidators([Validators.required]);
  }

  public setShowMoreNativePickerConfig(
    config: SkyLookupShowMoreNativePickerConfig,
  ): void {
    if (this.showMoreConfig) {
      this.showMoreConfig.nativePickerConfig = config;
    }
  }

  public setSingleSelect(): void {
    this.selectMode = 'single';
  }

  public setValue(index: number): void {
    if (this.data) {
      this.asyncForm.controls['friends'].setValue([this.data[index]]);
      this.form.controls['friends'].setValue([this.data[index]]);
    }
  }

  public removeRequired(): void {
    this.asyncForm.controls['friends'].setValidators([]);
    this.form.controls['friends'].setValidators([]);
  }
}
