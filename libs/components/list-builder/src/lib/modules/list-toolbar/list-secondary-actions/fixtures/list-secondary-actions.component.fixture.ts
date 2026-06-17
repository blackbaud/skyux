import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-secondary-actions.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ListSecondaryActionsTestComponent {
  public showOption = true;
}
