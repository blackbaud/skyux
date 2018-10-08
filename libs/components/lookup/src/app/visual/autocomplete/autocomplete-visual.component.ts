import {
  Component
} from '@angular/core';

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
}
