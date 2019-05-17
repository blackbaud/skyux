import {
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormGroup
} from '@angular/forms';

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
  constructor(
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.reactiveForm = this.formBuilder.group({
      favoriteColor: undefined
    });
  }
}
