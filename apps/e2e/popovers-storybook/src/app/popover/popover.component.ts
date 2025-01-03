import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {
  SkyPopoverMessage,
  SkyPopoverMessageType,
  SkyPopoverPlacement,
  SkyPopoverType,
} from '@skyux/popovers';

import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PopoverComponent implements AfterViewInit {
  public readonly ready = new BehaviorSubject(false);
  public readonly placements: SkyPopoverPlacement[] = [
    'above',
    'below',
    'right',
    'left',
  ];
  public readonly titles: (string | undefined)[] = [undefined, 'Did you know?'];
  public readonly popoverTypes: (SkyPopoverType | undefined)[] = [
    undefined,
    'danger',
  ];

  public staticPopoverMessageStream = new Subject<SkyPopoverMessage>();

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
