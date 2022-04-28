import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

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
  templateUrl: './lookup.component.fixture.html',
})
export class SkyLookupTestComponent implements OnInit {
  @ViewChild('asyncLookup', {
    read: SkyLookupComponent,
    static: true,
  })
  public asyncLookupComponent: SkyLookupComponent;

  @ViewChild('standardLookup', {
    read: SkyLookupComponent,
    static: true,
  })
  public lookupComponent: SkyLookupComponent;

  @ViewChild('customSearchResultTemplate')
  public searchResultTemplate: TemplateRef<unknown>;

  @ViewChild('customShowMoreTemplate')
  public showMoreTemplate: TemplateRef<unknown>;

  public ariaLabel: string;
  public ariaLabelledBy: string;
  public asyncForm: FormGroup;
  public autocompleteAttribute: string;
  public customSearch: SkyAutocompleteSearchFunction;
  public data: any[];
  public descriptorProperty: string;
  public enabledSearchResultTemplate: TemplateRef<unknown>;
  public enableShowMore = false;
  public form: FormGroup;
  public idProperty: string;
  public ignoreAddDataUpdate = false;
  public placeholderText: string;
  public propertiesToSearch: string[];
  public selectMode: SkyLookupSelectModeType;
  public showAddButton = false;
  public showMoreConfig: SkyLookupShowMoreConfig = {};

  public get friends(): any[] {
    return this._friends;
  }

  public set friends(value: any[]) {
    this._friends = value;

    if (this.form?.controls.friends) {
      this.form.controls.friends.setValue(value);
    }
    if (this.asyncForm?.controls.friends) {
      this.asyncForm.controls.friends.setValue(value);
    }
  }

  private _friends: any[];

  constructor(private formBuilder: FormBuilder) {}

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

    this.createForm();
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

  public enableCustomPicker(): void {
    this.showMoreConfig.customPicker = {
      open: (context: SkyLookupShowMoreCustomPickerContext) => {
        return;
      },
    };
  }

  public enableLookup(): void {
    this.asyncForm.controls.friends.enable();
    this.form.controls.friends.enable();
  }

  public enableSearchResultTemplate(): void {
    this.enabledSearchResultTemplate = this.searchResultTemplate;
  }

  public disableLookup(): void {
    this.asyncForm.controls.friends.disable();
    this.form.controls.friends.disable();
  }

  public resetForm(): void {
    this.asyncForm.reset();
    this.form.reset();
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

  public setRequired(): void {
    this.asyncForm.controls.friends.setValidators([Validators.required]);
    this.form.controls.friends.setValidators([Validators.required]);
  }

  public setShowMoreNativePickerConfig(
    config: SkyLookupShowMoreNativePickerConfig
  ): void {
    this.showMoreConfig.nativePickerConfig = config;
  }

  public setSingleSelect(): void {
    this.selectMode = 'single';
  }

  public setValue(index: number): void {
    this.asyncForm.controls.friends.setValue([this.data[index]]);
    this.form.controls.friends.setValue([this.data[index]]);
  }

  public removeRequired(): void {
    this.asyncForm.controls.friends.setValidators([]);
    this.form.controls.friends.setValidators([]);
  }

  private createForm(): void {
    this.asyncForm = this.formBuilder.group({
      friends: new FormControl(this.friends),
    });
    this.form = this.formBuilder.group({
      friends: new FormControl(this.friends),
    });
  }
}
