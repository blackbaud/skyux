import {
  Component,
  Input
} from '@angular/core';

import {
  StacheNavLink
} from '../../nav/nav-link';

@Component({
  selector: 'stache-test-component',
  templateUrl: './nav.component.fixture.html'
})
export class StacheNavTestComponent {
  @Input()
  public routes: StacheNavLink[] = [];
}
