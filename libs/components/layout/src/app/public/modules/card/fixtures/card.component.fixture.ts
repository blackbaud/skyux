import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyCardComponent
} from '../card.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './card.component.fixture.html'
})
export class CardTestComponent {

  @ViewChild(SkyCardComponent)
  public card: SkyCardComponent;

  public cardSelected = false;

  public showCheckbox = true;

  public showTitle = true;

  public showActions = false;

  public cardSize = 'large';
}
