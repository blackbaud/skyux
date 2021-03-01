import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  SkyLookupComponent
} from '../lookup.component';

import {
  SkyLookupSelectMode
} from '../types/lookup-select-mode';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './lookup.component.fixture.html'
})
export class SkyLookupTestComponent implements OnInit {

  @ViewChild(SkyLookupComponent, {
    read: SkyLookupComponent,
    static: true
  })
  public lookupComponent: SkyLookupComponent;

  public ariaLabel: string;
  public ariaLabelledBy: string;
  public autocompleteAttribute: string;
  public data: any[];
  public friends: any[];
  public form: FormGroup;
  public idProperty: string;
  public placeholderText: string;
  public selectMode: SkyLookupSelectMode;

  constructor(
    private formBuilder: FormBuilder
  ) { }

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

    this.createForm();
  }

  public enableLookup(): void {
    this.form.controls.friends.enable();
  }

  public disableLookup(): void {
    this.form.controls.friends.disable();
  }

  public setMultiSelect(): void {
    this.selectMode = SkyLookupSelectMode.multiple;
  }

  public setRequired(): void {
    this.form.controls.friends.setValidators([Validators.required]);
  }

  public setSingleSelect(): void {
    this.selectMode = SkyLookupSelectMode.single;
  }

  public removeRequired(): void {
    this.form.controls.friends.setValidators([]);
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      friends: new FormControl(this.friends)
    });
  }
}
