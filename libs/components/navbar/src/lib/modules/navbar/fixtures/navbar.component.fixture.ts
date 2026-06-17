import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './navbar.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyNavbarTestComponent {}
