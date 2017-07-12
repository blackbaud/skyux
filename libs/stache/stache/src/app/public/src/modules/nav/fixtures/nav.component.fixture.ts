import { Component, Input } from '@angular/core';
import { StacheNavLink } from '../index';

@Component({
  selector: 'stache-test-component',
  templateUrl: './nav.component.fixture.html'
})
export class StacheNavTestComponent {
  @Input()
  public routes: StacheNavLink[] = [];
}
