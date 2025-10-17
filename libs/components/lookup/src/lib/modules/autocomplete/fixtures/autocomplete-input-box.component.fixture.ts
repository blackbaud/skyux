import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';

import { SkyAutocompleteModule } from '../autocomplete.module';

@Component({
  imports: [FormsModule, SkyAutocompleteModule, SkyInputBoxModule],
  selector: 'sky-autocomplete-input-box-fixture',
  templateUrl: './autocomplete-input-box.component.fixture.html',
})
export class SkyAutocompleteInputBoxFixtureComponent {
  public autocompleteAttribute: string | undefined;

  public data:
    | { objectid?: string; name?: string; text?: string }[]
    | undefined = [
    { name: 'Red', objectid: 'abc' },
    { name: 'Blue', objectid: 'def' },
    { name: 'Green', objectid: 'ghi' },
    { name: 'Orange', objectid: 'jkl' },
    { name: 'Pink', objectid: 'mno' },
    { name: 'Purple', objectid: 'pqr' },
    { name: 'Yellow', objectid: 'stu' },
    { name: 'Brown', objectid: 'vwx' },
    { name: 'Turquoise', objectid: 'yz0' },
    { name: 'White', objectid: '123' },
    { name: 'Black', objectid: '456' },
  ];

  public model: {
    favoriteColor:
      | { objectid?: string; name?: string; text?: string }
      | undefined;
  } = { favoriteColor: {} };
}
