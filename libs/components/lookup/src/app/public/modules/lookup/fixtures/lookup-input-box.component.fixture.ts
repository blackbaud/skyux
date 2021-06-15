import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  SkyLookupComponent
} from '../lookup.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './lookup-input-box.component.fixture.html'
})
export class SkyLookupInputBoxTestComponent implements OnInit {

  @ViewChild(SkyLookupComponent, {
    static: true
  })
  public lookupComponent: SkyLookupComponent;

  public autocompleteAttribute: string;
  public data: any[];
  public friends: any[];
  public form: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit(): void {
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
      { id: 17, name: 'Zack' }
    ];

    this.createForm();
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      friends: new FormControl(this.friends)
    });
  }
}
