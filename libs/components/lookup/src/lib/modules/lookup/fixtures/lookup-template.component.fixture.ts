import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { SkyAutocompleteSearchAsyncArgs } from '../../autocomplete/types/autocomplete-search-async-args';
import { SkyAutocompleteSearchFunction } from '../../autocomplete/types/autocomplete-search-function';
import { SkyLookupComponent } from '../lookup.component';
import { SkyLookupAddCallbackArgs } from '../types/lookup-add-click-callback-args';
import { SkyLookupAddClickEventArgs } from '../types/lookup-add-click-event-args';
import { SkyLookupSelectModeType } from '../types/lookup-select-mode-type';
import { SkyLookupShowMoreConfig } from '../types/lookup-show-more-config';
import { SkyLookupShowMoreCustomPickerContext } from '../types/lookup-show-more-custom-picker-context';
import { SkyLookupShowMoreNativePickerConfig } from '../types/lookup-show-more-native-picker-config';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './lookup-template.component.fixture.html',
  standalone: false,
})
export class SkyLookupTemplateTestComponent implements OnInit {
  @ViewChild('asyncLookup', {
    static: true,
  })
  public asyncLookupComponent!: SkyLookupComponent;

  @ViewChild('standardLookup', {
    static: true,
  })
  public lookupComponent!: SkyLookupComponent;

  @ViewChild('customSearchResultTemplate', { read: TemplateRef, static: true })
  public searchResultTemplate!: TemplateRef<unknown>;

  @ViewChild('customShowMoreTemplate', { read: TemplateRef, static: true })
  public showMoreTemplate!: TemplateRef<unknown>;

  public ariaLabel: string | undefined;

  public ariaLabelledBy: string | undefined;

  public customSearch: SkyAutocompleteSearchFunction | undefined;

  public data: any[] | undefined;

  public descriptorProperty: string | undefined;

  public disabled: boolean | undefined = false;

  public enabledSearchResultTemplate: TemplateRef<unknown> | undefined;

  public enableShowMore: boolean | undefined = false;

  public idProperty: string | undefined = 'name';

  public ignoreAddDataUpdate = false;

  public placeholderText: string | undefined;

  public propertiesToSearch: string[] | undefined;

  public required = false;

  public selectedFriends: any;

  public selectedFriendsAsync: any;

  public selectMode: SkyLookupSelectModeType | undefined;

  public showAddButton: boolean | undefined = false;

  public showMoreConfig: SkyLookupShowMoreConfig | undefined = {};

  public ngOnInit(): void {
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
  }

  public addButtonClicked(
    addButtonClickArgs: SkyLookupAddClickEventArgs,
  ): void {
    const newItem = { name: 'New item' };
    const newItems = [newItem].concat(this.data || []);
    const callbackArgs: SkyLookupAddCallbackArgs = {
      item: newItem,
      data: this.ignoreAddDataUpdate ? undefined : newItems,
    };
    addButtonClickArgs.itemAdded(callbackArgs);
  }

  public enableLookup(): void {
    this.disabled = false;
  }

  public disableLookup(): void {
    this.disabled = true;
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

  public enableSearchResultTemplate(): void {
    this.enabledSearchResultTemplate = this.searchResultTemplate;
  }

  public setRequired(): void {
    this.required = true;
  }

  public removeRequired(): void {
    this.required = false;
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
}
