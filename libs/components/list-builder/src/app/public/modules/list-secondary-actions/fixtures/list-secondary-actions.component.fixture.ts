import {
  Component,
  ViewChild
} from '@angular/core';

import { SkyListSecondaryActionsComponent } from '../list-secondary-actions.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-secondary-actions.component.fixture.html'
})
export class ListSecondaryActionsTestComponent {
  public showOption = true;

  @ViewChild(SkyListSecondaryActionsComponent)
  public secondaryActions: SkyListSecondaryActionsComponent;
}
