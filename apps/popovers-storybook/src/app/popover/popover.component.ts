import { AfterViewInit, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SkyPopoverMessage, SkyPopoverMessageType } from '@skyux/popovers';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements AfterViewInit {
  public popoverType = new FormControl('info');

  public staticPopoverMessageStream = new Subject<SkyPopoverMessage>();

  public configs = [
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
  }
}
