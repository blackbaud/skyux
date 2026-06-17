import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sky-id-directive-test',
  templateUrl: './id.directive.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class IdDirectiveFixtureComponent {}
