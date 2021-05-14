import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  FormBuilder,
  FormGroup
} from '@angular/forms';

import {
  SkyAutocompleteComponent
} from '../autocomplete.component';

@Component({
  selector: 'sky-autocomplete-reactive-fixture',
  templateUrl: './autocomplete-reactive.component.fixture.html'
})
export class SkyAutocompleteReactiveFixtureComponent implements OnInit {

  public reactiveForm: FormGroup;

  public data: any[] = [
    { name: 'Red' },
    { name: 'Blue' },
    { name: 'Green' },
    { name: 'Orange' },
    { name: 'Pink' },
    { name: 'Purple' },
    { name: 'Yellow' },
    { name: 'Brown' },
    { name: 'Turquoise' },
    { name: 'White' },
    { name: 'Black' }
  ];

  public showAddButton: boolean = false;

  @ViewChild(SkyAutocompleteComponent, {
    read: SkyAutocompleteComponent,
    static: true
  })
  public autocomplete: SkyAutocompleteComponent;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      favoriteColor: undefined
    });
  }

  public addButtonClicked(): void {
    return;
  }

  public disableForm(): void {
    this.reactiveForm.get('favoriteColor').disable();
  }

  public enableForm(): void {
    this.reactiveForm.get('favoriteColor').enable();
  }
}
