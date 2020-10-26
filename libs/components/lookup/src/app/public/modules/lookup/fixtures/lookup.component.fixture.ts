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

import { SkyLookupComponent } from '../lookup.component';

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

  public enableLookup() {
    this.form.controls.friends.enable();
  }

  public disableLookup() {
    this.form.controls.friends.disable();
  }

  public setRequired() {
    this.form.controls.friends.setValidators([Validators.required]);
  }

  public removeRequired() {
    this.form.controls.friends.setValidators([]);
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      friends: new FormControl(this.friends)
    });
  }
}
