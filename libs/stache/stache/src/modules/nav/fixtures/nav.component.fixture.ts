import { StacheNavLink } from '../';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'stache-test-component',
  templateUrl: './nav.component.fixture.html'
})
export class StacheNavTestComponent {
  @Input()
  public routes: StacheNavLink[] = [];
}
