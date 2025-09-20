import { Component, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

import { SkyLookupComponent } from '../lookup.component';
import { SkyLookupSelectModeType } from '../types/lookup-select-mode-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './lookup-input-box.component.fixture.html',
  standalone: false,
})
export class SkyLookupInputBoxTestComponent {
  @ViewChild(SkyLookupComponent, {
    static: true,
  })
  public lookupComponent!: SkyLookupComponent;

  public ariaLabel: string | undefined;

  public ariaLabelledBy: string | undefined;

  public autocompleteAttribute: string | undefined;

  public data: any[] = [];

  public enableShowMore = false;

  public friends: any[] = [];

  public form: UntypedFormGroup;

  public required = false;

  public selectMode: SkyLookupSelectModeType | undefined;

  constructor(formBuilder: UntypedFormBuilder) {
    this.data = [
      { id: 1, name: 'Andy' },
      { id: 2, name: 'Beth' },
      { id: 3, name: 'David' },
      { id: 4, name: 'Frank' },
      { id: 5, name: 'Isaac' },
      { id: 6, name: 'John' },
      { id: 7, name: 'Joyce' },
      { id: 8, name: 'Lindsey' },
      { id: 9, name: 'Mitch' },
      { id: 10, name: 'Patty' },
      { id: 11, name: 'Paul' },
      { id: 12, name: 'Sally' },
      { id: 13, name: 'Susan' },
      { id: 14, name: 'Vanessa' },
      { id: 15, name: 'Xavier' },
      { id: 16, name: 'Yolanda' },
      { id: 17, name: 'Zack' },
    ];

    this.form = formBuilder.group({
      friends: new UntypedFormControl(this.friends),
    });
  }

  public resetForm(): void {
    this.form.reset();
  }

  public setMultiSelect(): void {
    this.selectMode = 'multiple';
  }

  public setSingleSelect(): void {
    this.selectMode = 'single';
  }

  public setValue(index: number | undefined): void {
    if (this.data && index) {
      this.form.controls['friends'].setValue([this.data[index]]);
    } else {
      this.form.controls['friends'].setValue(undefined);
    }
  }
}
