import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  SkyLookupComponent
} from '../lookup.component';

import {
  SkyLookupSelectMode
} from '../types/lookup-select-mode';
import {
  SkyLookupShowMoreConfig
} from '../types/lookup-show-more-config';

import {
  SkyLookupShowMoreCustomPickerContext
} from '../types/lookup-show-more-custom-picker-context';

import {
  SkyLookupShowMoreNativePickerConfig
} from '../types/lookup-show-more-native-picker-config';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './lookup-template.component.fixture.html'
})
export class SkyLookupTemplateTestComponent implements OnInit {

  @ViewChild(SkyLookupComponent, {
    static: true
  })
  public lookupComponent: SkyLookupComponent;

  @ViewChild('customSearchResultTemplate', { read: TemplateRef, static: true })
  public searchResultTemplate: TemplateRef<any>;

  @ViewChild('customShowMoreTemplate', { read: TemplateRef, static: true })
  public showMoreTemplate: TemplateRef<any>;

  public ariaLabel: string;
  public ariaLabelledBy: string;
  public data: any[];
  public descriptorProperty: string;
  public disabled: boolean = false;
  public enabledSearchResultTemplate: TemplateRef<any>;
  public enableShowMore: boolean = false;
  public placeholderText: string;
  public required: boolean = false;
  public selectedFriends: any;
  public selectMode: SkyLookupSelectMode = SkyLookupSelectMode.multiple;
  public showAddButton: boolean = false;
  public showMoreConfig: SkyLookupShowMoreConfig = {};

  public ngOnInit(): void {
    this.data = [
      {
        name: 'Andy',
        description: 'Mr. Andy',
        birthDate: '1/1/1995'
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
        birthDate: '1/1/1996'
      },
      {
        name: 'Paul',
        description: 'Mr. Paul',
        birthDate: '11/1997'
      },
      { name: 'Sally' },
      { name: 'Susan' },
      { name: 'Vanessa' },
      { name: 'Vinny' },
      { name: 'Xavier' },
      { name: 'Yolanda' },
      { name: 'Zack' }
    ];
  }

  public addButtonClicked(): void {
    return;
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
      }
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

  public setMultiSelect(): void {
    this.selectMode = SkyLookupSelectMode.multiple;
  }

  public setShowMoreNativePickerConfig(config: SkyLookupShowMoreNativePickerConfig): void {
    this.showMoreConfig.nativePickerConfig = config;
  }

  public setSingleSelect(): void {
    this.selectMode = SkyLookupSelectMode.single;
  }
}
