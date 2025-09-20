import { Component, Input } from '@angular/core';

import { SkyScreenReaderLabelDirective } from '../screen-reader-label.directive';

@Component({
  selector: 'sky-screen-reader-label-directive-test',
  templateUrl: './screen-reader-label.directive.fixture.html',
  imports: [SkyScreenReaderLabelDirective],
})
export class ScreenReaderLabelFixtureComponent {
  @Input()
  public createLabel1 = false;

  @Input()
  public createLabel2?: boolean;
}
