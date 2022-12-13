import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import {
  SkyPopoverMessage,
  SkyPopoverMessageType,
  SkyPopoverPlacement,
} from '@skyux/popovers';

import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PopoverComponent implements AfterViewInit {
  public ready = new BehaviorSubject(false);

  public staticPopoverMessageStream = new Subject<SkyPopoverMessage>();

  public configs: {
    horizontalAlignment: string;
    placement: SkyPopoverPlacement;
    popoverTitle: string | undefined;
  }[] = [
    {
      horizontalAlignment: 'center',
      placement: 'above',
      popoverTitle: undefined,
    },
    {
      horizontalAlignment: 'center',
      placement: 'below',
      popoverTitle: undefined,
    },
    {
      horizontalAlignment: 'center',
      placement: 'right',
      popoverTitle: undefined,
    },
    {
      horizontalAlignment: 'center',
      placement: 'left',
      popoverTitle: undefined,
    },
    {
      horizontalAlignment: 'center',
      placement: 'above',
      popoverTitle: 'Did you know?',
    },
    {
      horizontalAlignment: 'center',
      placement: 'below',
      popoverTitle: 'Did you know?',
    },
    {
      horizontalAlignment: 'center',
      placement: 'right',
      popoverTitle: 'Did you know?',
    },
    {
      horizontalAlignment: 'center',
      placement: 'left',
      popoverTitle: 'Did you know?',
    },
  ];

  public ngAfterViewInit(): void {
    this.staticPopoverMessageStream.next({
      type: SkyPopoverMessageType.Open,
    });

    this.staticPopoverMessageStream.next({
      type: SkyPopoverMessageType.Reposition,
    });

    setTimeout(() => {
      this.ready.next(true);
    }, 100);
  }
}
