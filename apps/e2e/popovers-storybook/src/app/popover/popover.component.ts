import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import {
  SkyPopoverMessage,
  SkyPopoverMessageType,
  SkyPopoverModule,
  SkyPopoverPlacement,
  SkyPopoverType,
} from '@skyux/popovers';

import { Subject } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgClass, SkyPopoverModule],
  selector: 'app-popover',
  styleUrl: './popover.component.scss',
  templateUrl: './popover.component.html',
})
export default class PopoverComponent implements AfterViewInit {
  protected readonly ready = signal(false);

  protected readonly placements: SkyPopoverPlacement[] = [
    'above',
    'below',
    'right',
    'left',
  ];

  protected readonly titles: (string | undefined)[] = [
    undefined,
    'Did you know?',
  ];

  protected readonly popoverTypes: (SkyPopoverType | undefined)[] = [
    undefined,
    'danger',
  ];

  protected staticPopoverMessageStream = new Subject<SkyPopoverMessage>();

  readonly #popoversCount =
    this.placements.length * this.titles.length * this.popoverTypes.length;

  #popoversOpenCount = 0;

  public ngAfterViewInit(): void {
    this.staticPopoverMessageStream.next({
      type: SkyPopoverMessageType.Open,
    });
  }

  protected onPopoverOpened(): void {
    this.#popoversOpenCount++;

    if (this.#popoversOpenCount === this.#popoversCount) {
      setTimeout(() => {
        this.ready.set(true);
      });
    }
  }
}
