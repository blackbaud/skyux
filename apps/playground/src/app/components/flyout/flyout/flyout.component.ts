import { Component, OnDestroy } from '@angular/core';
import { SkyFlyoutInstance, SkyFlyoutService } from '@skyux/flyout';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FlyoutDemoContext } from './flyout-demo-context';
import { FlyoutDemoComponent } from './flyout-demo.component';
import { FlyoutResponsiveDemoComponent } from './flyout-responsive-demo.component';

@Component({
  selector: 'app-flyout',
  templateUrl: './flyout.component.html',
  styleUrls: ['./flyout.component.scss'],
})
export class FlyoutComponent implements OnDestroy {
  public users: { id: string; name: string }[] = [
    { id: '1', name: 'Sally' },
    { id: '2', name: 'John' },
    { id: '3', name: 'David' },
    { id: '4', name: 'Janet' },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public flyout: SkyFlyoutInstance<any>;

  private ngUnsubscribe = new Subject();

  constructor(private flyoutService: SkyFlyoutService) {}

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public openFlyout(record: any): void {
    this.flyout = this.flyoutService.open(FlyoutDemoComponent, {
      providers: [
        {
          provide: FlyoutDemoContext,
          useValue: record,
        },
      ],
      ariaLabel: 'User details',
      defaultWidth: 500,
    });
  }

  public openFlyoutWithIterators(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    record: any,
    previousButtonDisabled: boolean,
    nextButtonDisabled: boolean
  ): void {
    this.flyout = this.flyoutService.open(FlyoutDemoComponent, {
      providers: [
        {
          provide: FlyoutDemoContext,
          useValue: record,
        },
      ],
      defaultWidth: 500,
      showIterator: true,
      iteratorPreviousButtonDisabled: previousButtonDisabled,
      iteratorNextButtonDisabled: nextButtonDisabled,
    });

    this.flyout.iteratorPreviousButtonClick
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        console.log('previous clicked');
      });

    this.flyout.iteratorNextButtonClick
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        console.log('next clicked');
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public openFlyoutWithFullscreenAvailable(record: any): void {
    this.flyout = this.flyoutService.open(FlyoutDemoComponent, {
      providers: [
        {
          provide: FlyoutDemoContext,
          useValue: record,
        },
      ],
      minWidth: 600,
      defaultWidth: 800,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public openFlyoutWithPermalink(record: any): void {
    this.flyout = this.flyoutService.open(FlyoutDemoComponent, {
      providers: [
        {
          provide: FlyoutDemoContext,
          useValue: record,
        },
      ],
      minWidth: 600,
      defaultWidth: 800,
      permalink: {
        label: 'Go home',
        url: '/',
      },
    });
  }

  public openResponsiveFlyout(width: number): void {
    this.flyout = this.flyoutService.open(FlyoutResponsiveDemoComponent, {
      defaultWidth: width,
      maxWidth: 5000,
    });
  }
}
