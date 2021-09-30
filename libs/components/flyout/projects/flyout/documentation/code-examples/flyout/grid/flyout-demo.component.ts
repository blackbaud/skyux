import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyFlyoutConfig,
  SkyFlyoutInstance,
  SkyFlyoutService
} from 'projects/flyout/src/public-api';

import {
  ListItemModel
} from '@skyux/list-builder-common';

import {
  SkyListViewGridComponent
} from '@skyux/list-builder-view-grids';

import {
  of,
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  FlyoutDemoContext
} from './flyout-demo-context';

import {
  FlyoutDemoFlyoutComponent
} from './flyout-demo-flyout.component';

@Component({
  selector: 'app-flyout-demo',
  templateUrl: './flyout-demo.component.html'
})
export class FlyoutDemoComponent {

  public flyout: SkyFlyoutInstance<any>;

  public rowHighlightedId: string;

  public users = of([
    { id: '1', name: 'Troy Barnes', constituentCode: 'Alumnus', latestGift: 175, status: 'Paid' },
    { id: '2', name: 'Britta Perry', constituentCode: 'Friend', latestGift: 5, status: 'Past due' },
    { id: '3', name: 'Pierce Hawthorne', constituentCode: 'Board Member', latestGift: 1500, status: 'Paid' },
    { id: '4', name: 'Annie Edison', constituentCode: 'Alumnus', latestGift: 100, status: 'Paid' },
    { id: '5', name: 'Shirley Bennett', constituentCode: 'Board Member', latestGift: 250, status: 'Paid' },
    { id: '6', name: 'Jeff Winger', constituentCode: 'Friend', latestGift: 250, status: 'Paid' },
    { id: '7', name: 'Abed Nadir', constituentCode: 'Major Donor', latestGift: 100000, status: 'Paid' }
  ]);

  @ViewChild(SkyListViewGridComponent)
  public listViewGridComponent: SkyListViewGridComponent;

  private listState: ListItemModel[];

  private openFlyoutStream = new Subject<boolean>();

  constructor(
    private flyoutService: SkyFlyoutService
  ) { }

  public onNameClick(record: FlyoutDemoContext): void {
    this.openRecord(record);
  }

  private openRecord(record: FlyoutDemoContext) {

    // Prevent highlight from being prematurely removed.
    this.openFlyoutStream.next(true);

    const flyoutConfig: SkyFlyoutConfig = {
      providers: [{
        provide: FlyoutDemoContext,
        useValue: record
      }],
      ariaLabelledBy: 'flyout-title',
      ariaRole: 'dialog',
      permalink: {
        route: {
          commands: ['/users', record.id],
          extras: {
            queryParams: {
              envid: '123456789'
            }
          }
        }
      },
      showIterator: true
    };

    this.flyout = this.flyoutService.open(FlyoutDemoFlyoutComponent, flyoutConfig);

    this.flyout.closed.subscribe(() => {
      this.flyout = undefined;
    });

    this.initIterators(record, this.flyout);
  }

  private initIterators(record: any, flyout: SkyFlyoutInstance<any>) {
    this.rowHighlightedId = record.id;

    // Remove highlights when flyout is closed.
    flyout.closed
      .pipe(takeUntil(this.openFlyoutStream))
      .subscribe(() => {
        this.rowHighlightedId = undefined;
    });

    this.listViewGridComponent.items
      .pipe(takeUntil(this.openFlyoutStream))
      .subscribe((s: any) => {
        this.listState = s;

        flyout.iteratorPreviousButtonDisabled = this.isFirstElementInArray(this.rowHighlightedId, this.listState);
        flyout.iteratorNextButtonDisabled = this.isLastElementInArray(this.rowHighlightedId, this.listState);
    });

    flyout.iteratorPreviousButtonClick
      .pipe(takeUntil(this.openFlyoutStream))
      .subscribe(() => {
        const previous = this.stepToItemInArray(this.listState, this.rowHighlightedId, -1);
        this.openRecord(previous.data);
    });

    flyout.iteratorNextButtonClick
      .pipe(takeUntil(this.openFlyoutStream))
      .subscribe(() => {
        const next = this.stepToItemInArray(this.listState, this.rowHighlightedId, 1);
        this.openRecord(next.data);
    });

    flyout.iteratorPreviousButtonDisabled = this.isFirstElementInArray(this.rowHighlightedId, this.listState);
    flyout.iteratorNextButtonDisabled = this.isLastElementInArray(this.rowHighlightedId, this.listState);
  }

  private stepToItemInArray(array: Array<any>, currentId: string, step: number) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === currentId) {
        return array[i + step];
      }
    }
  }

  private isFirstElementInArray(id: any, array: any[]) {
    const element = array.find(x => x.id === id);
    if (array[0] === element) {
      return true;
    }
    return false;
  }

  private isLastElementInArray(id: any, array: any[]) {
    const element = array.find(x => x.id === id);
    if (array[array.length - 1] === element) {
      return true;
    }
    return false;
  }
}
