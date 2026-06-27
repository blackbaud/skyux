import { Component, input } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-secondary-actions.component.fixture.html',
  standalone: false,
})
export class ListSecondaryActionsTestComponent {
  public showOption = input<boolean>(true);
}
