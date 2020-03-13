import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  SkyLookupComponent
} from '../lookup.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './lookup-template.component.fixture.html'
})
export class SkyLookupTemplateTestComponent implements OnInit {

  @ViewChild(SkyLookupComponent)
  public lookupComponent: SkyLookupComponent;

  public ariaLabel: string;
  public ariaLabelledBy: string;
  public data: any[];
  public disabled: boolean = false;
  public friends: any[];
  public placeholderText: string;
  public required: boolean = false;

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

  public enableLookup() {
    this.disabled = false;
  }

  public disableLookup() {
    this.disabled = true;
  }

  public setRequired() {
    this.required = true;
  }

  public removeRequired() {
    this.required = false;
  }
}
