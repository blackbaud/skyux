import {
  Component
} from '@angular/core';

import {
  SkyAutocompleteSelectionChange
} from '../../public';

@Component({
  selector: 'autocomplete-visual',
  templateUrl: './autocomplete-visual.component.html'
})
export class AutocompleteVisualComponent {
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

  public onSelectionChange(change: SkyAutocompleteSelectionChange): void {
    console.log(change);
  }
}
