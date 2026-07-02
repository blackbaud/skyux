import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, input } from '@angular/core';

import { SkyScrollShadowEventArgs } from '../scroll-shadow-event-args';
import { SkyScrollShadowDirective } from '../scroll-shadow.directive';

@Component({
  selector: 'sky-scroll-shadow-fixture',
  styleUrls: ['./scroll-shadow.component.fixture.scss'],
  templateUrl: './scroll-shadow.component.fixture.html',
  imports: [CommonModule, SkyScrollShadowDirective],
})
export class ScrollShadowFixtureComponent {
  public enabled = input(true);
  public height = input(400);
  public scrollShadow: SkyScrollShadowEventArgs | undefined;

  #changeDetector = inject(ChangeDetectorRef);

  public scrollShadowChange(args: SkyScrollShadowEventArgs): void {
    this.scrollShadow = args;
    this.#changeDetector.markForCheck();
  }
}
