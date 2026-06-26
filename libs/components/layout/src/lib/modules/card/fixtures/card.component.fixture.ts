import { Component, ViewChild, input, model } from '@angular/core';

import { SkyCardComponent } from '../card.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './card.component.fixture.html',
  standalone: false,
})
export class CardTestComponent {
  @ViewChild(SkyCardComponent, {
    read: SkyCardComponent,
    static: false,
  })
  public card!: SkyCardComponent;

  public cardSelected = model<boolean | undefined>(undefined);

  public showCheckbox = input<boolean | undefined>(true);

  public showTitle = input<boolean>(true);

  public showActions = input<boolean>(false);

  public showDelete = input<boolean>(false);

  public cardSize = input<string | undefined>(undefined);
}
