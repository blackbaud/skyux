import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  SkyLookupComponent
} from '../lookup.component';

import {
  SkyLookupSelectMode
} from '../types/lookup-select-mode';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './lookup-template.component.fixture.html'
})
export class SkyLookupTemplateTestComponent implements OnInit {

  @ViewChild(SkyLookupComponent, {
    static: true
  })
  public lookupComponent: SkyLookupComponent;

  public ariaLabel: string;
  public ariaLabelledBy: string;
  public data: any[];
  public disabled: boolean = false;
  public placeholderText: string;
  public required: boolean = false;
  public selectedFriends: any;
  public selectMode: SkyLookupSelectMode = SkyLookupSelectMode.multiple;
  public showAddButton: boolean = false;

  public ngOnInit(): void {
    this.data = [
      { name: 'Andy' },
      { name: 'Beth' },
      { name: 'David' },
      { name: 'Frank' },
      { name: 'Isaac' },
      { name: 'John' },
      { name: 'Joyce' },
      { name: 'Lindsey' },
      { name: 'Mitch' },
      { name: 'Patty' },
      { name: 'Paul' },
      { name: 'Sally' },
      { name: 'Susan' },
      { name: 'Vanessa' },
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

  public setRequired(): void {
    this.required = true;
  }

  public removeRequired(): void {
    this.required = false;
  }

  public setMultiSelect(): void {
    this.selectMode = SkyLookupSelectMode.multiple;
  }

  public setSingleSelect(): void {
    this.selectMode = SkyLookupSelectMode.single;
  }
}
