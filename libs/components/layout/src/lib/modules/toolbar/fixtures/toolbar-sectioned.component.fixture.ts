import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './toolbar-sectioned.component.fixture.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SkyToolbarSectionedTestComponent {}
