import {
  Component
} from '@angular/core';

import {
  SkyToken
} from '../../public/modules/tokens/types/token';

@Component({
  selector: 'sky-tokens-demo',
  templateUrl: './tokens-demo.component.html'
})
export class SkyTokensDemoComponent {
  public colors: SkyToken[] = [
    { name: 'Black' },
    { name: 'Blue' },
    { name: 'Brown' },
    { name: 'Green' },
    { name: 'Orange' },
    { name: 'Pink' },
    { name: 'Purple' },
    { name: 'Red' },
    { name: 'Turquoise' },
    { name: 'White' },
    { name: 'Yellow' }
  ].map(value => ({ value }));

  public filters: SkyToken[] = [
    { label: 'Canada' },
    { label: 'Older than 55' },
    { label: 'Employed' },
    { label: 'Added before 2018' }
  ].map(value => ({ value }));
}
