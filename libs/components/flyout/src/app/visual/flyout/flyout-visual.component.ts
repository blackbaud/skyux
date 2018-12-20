import {
  Component,
  OnDestroy
} from '@angular/core';

import {
  Subject
} from 'rxjs/Subject';

import {
  SkyFlyoutInstance,
  SkyFlyoutService
} from '../../public';

import {
  FlyoutDemoComponent
} from './flyout-demo.component';

import {
  FlyoutDemoContext
} from './flyout-demo-context';

@Component({
  selector: 'flyout-visual',
  templateUrl: './flyout-visual.component.html',
  styleUrls: ['./flyout-visual.component.scss']
})
export class FlyoutVisualComponent implements OnDestroy {
  public users: {id: string, name: string}[] = [
    { id: '1', name: 'Sally' },
    { id: '2', name: 'John' },
    { id: '3', name: 'David' },
    { id: '4', name: 'Janet' }
  ];

  public flyout: SkyFlyoutInstance<any>;

  private ngUnsubscribe = new Subject();

  constructor(
    private flyoutService: SkyFlyoutService
  ) { }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public openFlyout(record: any) {
    this.flyoutService.open(FlyoutDemoComponent, {
      providers: [{
        provide: FlyoutDemoContext,
        useValue: record
      }]
    });
  }

  public openFlyoutWithIterators(record: any, previousButtonDisabled: boolean, nextButtonDisabled: boolean) {
    this.flyout = this.flyoutService.open(FlyoutDemoComponent, {
      providers: [{
        provide: FlyoutDemoContext,
        useValue: record
      }],
      showIterator: true,
      iteratorPreviousButtonDisabled: previousButtonDisabled,
      iteratorNextButtonDisabled: nextButtonDisabled
    });

    this.flyout.iteratorPreviousButtonClick
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        console.log('previous clicked');
      });

    this.flyout.iteratorNextButtonClick
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        console.log('next clicked');
      });
  }
}
