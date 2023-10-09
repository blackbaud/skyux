import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, inject } from '@angular/core';

import { SkyScreenReaderLabelDirective } from '../screen-reader-label.directive';

@Component({
  selector: 'sky-screen-reader-label-directive-test',
  templateUrl: './screen-reader-label.directive.fixture.html',
  standalone: true,
  imports: [CommonModule, SkyScreenReaderLabelDirective],
})
export class ScreenReaderLabelFixtureComponent {
  @Input()
  public createLabel1 = false;

  @Input()
  public createLabel2?: boolean;

  public destroyRef = inject(DestroyRef);
}
