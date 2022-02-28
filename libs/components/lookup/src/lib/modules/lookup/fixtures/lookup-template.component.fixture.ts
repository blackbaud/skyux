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
})
export class SkyLookupTemplateTestComponent implements OnInit {
  @ViewChild('asyncLookup', {
    static: true,
  })
  public asyncLookupComponent: SkyLookupComponent;

  @ViewChild('standardLookup', {
    static: true,
  })
  public lookupComponent: SkyLookupComponent;

  @ViewChild('customSearchResultTemplate', { read: TemplateRef, static: true })
  public searchResultTemplate: TemplateRef<any>;

  @ViewChild('customShowMoreTemplate', { read: TemplateRef, static: true })
  public showMoreTemplate: TemplateRef<any>;

  public ariaLabel: string;
  public ariaLabelledBy: string;
  public customSearch: SkyAutocompleteSearchFunction;
  public data: any[];
  public descriptorProperty: string;
  public disabled = false;
  public enabledSearchResultTemplate: TemplateRef<any>;
  public enableShowMore = false;
  public idProperty: string;
  public ignoreAddDataUpdate = false;
  public placeholderText: string;
  public propertiesToSearch: string[];
  public required = false;
  public selectedFriends: any;
  public selectedFriendsAsync: any;
  public selectMode: SkyLookupSelectModeType;
  public showAddButton = false;
  public showMoreConfig: SkyLookupShowMoreConfig = {};

  public ngOnInit(): void {
    this.data = [
      {
        name: 'Andy',
        description: 'Mr. Andy',
        birthDate: '1/1/1995',
      },
      { name: 'Beth' },
      { name: 'Dan' },
      { name: 'David' },
      { name: 'Frank' },
      { name: 'Fred' },
      { name: 'Isaac' },
      { name: 'John' },
      { name: 'Joyce' },
      { name: 'Lindsey' },
      { name: 'Mitch' },
      { name: 'Oliver' },
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
      { name: 'Sally' },
      { name: 'Susan' },
      { name: 'Vanessa' },
      { name: 'Vinny' },
      { name: 'Xavier' },
      { name: 'Yolanda' },
      { name: 'Zack' },
    ];
  }

  public addButtonClicked(
    addButtonClickArgs: SkyLookupAddClickEventArgs
  ): void {
    const newItem = { name: 'New item' };
    const newItems = [newItem].concat(this.data);
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
    this.showMoreConfig.customPicker = {
      open: (context: SkyLookupShowMoreCustomPickerContext) => {
        return;
      },
    };
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
          (item) => item.name.toLowerCase().indexOf(searchText) >= 0
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
    config: SkyLookupShowMoreNativePickerConfig
  ): void {
    this.showMoreConfig.nativePickerConfig = config;
  }

  public setSingleSelect(): void {
    this.selectMode = 'single';
  }
}
