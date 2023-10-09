import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Input, inject } from '@angular/core';

import { SkySrLabelDirective } from '../sr-label.directive';

@Component({
  selector: 'sky-sr-label-directive-test',
  templateUrl: './sr-label.directive.fixture.html',
  standalone: true,
  imports: [CommonModule, SkySrLabelDirective],
})
export class SrLabelFixtureComponent {
  @Input()
  public createLabel1 = false;

  @Input()
  public createLabel2 = false;

  public destroyRef = inject(DestroyRef);
}
