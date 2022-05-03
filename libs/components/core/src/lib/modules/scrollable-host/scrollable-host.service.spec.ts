import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';

import { Subject } from 'rxjs';
import { delay, take, takeUntil } from 'rxjs/operators';

import { MutationObserverService } from '../mutation/mutation-observer-service';

import { ScrollableHostFixtureComponent } from './fixtures/scrollable-host.component.fixture';
import { SkyScrollableHostService } from './scrollable-host.service';

describe('Scrollable host service', () => {
  let cmp: ScrollableHostFixtureComponent;
  let fixture: ComponentFixture<ScrollableHostFixtureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScrollableHostFixtureComponent],
    });

    fixture = TestBed.createComponent(ScrollableHostFixtureComponent);
    cmp = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    fixture.detectChanges();
  });

  it('should return the current scrollable parent', () => {
    expect(cmp.getScrollableHost()).toBe(cmp.parent.nativeElement);
  });

  it('should return the window if no scrollable parent', () => {
    cmp.isParentScrollable = false;
    fixture.detectChanges();

    expect(cmp.getScrollableHost()).toBe(window);
  });

  it('should return the window if the element ref returns no native element', () => {
    cmp.isParentScrollable = false;
    fixture.detectChanges();

    expect(cmp.getScrollableHost({ nativeElement: undefined })).toBe(window);
  });

  it('should return the window if the element is not scrollable and the parent is not an element', () => {
    cmp.isParentScrollable = false;
    fixture.detectChanges();

    spyOnProperty(
      cmp.target.nativeElement,
      'parentNode',
      'get'
    ).and.returnValue(undefined);

    expect(cmp.getScrollableHost()).toBe(window);
  });

  it('should return an observable with the initial value of the current scrollable parent', async () => {
    const scrollableHostObservable = cmp.watchScrollableHost();

    scrollableHostObservable.pipe(take(1)).subscribe((scrollableHost) => {
      expect(scrollableHost).toBe(cmp.parent.nativeElement);
    });
  });

  // Using `done` here as with just `async` the test runner is moving the content when it shouldn't
  // which causes issues with finding the parent correctly.
  it('should update observable with new scrollable parent when it changes', (done) => {
    let obserableCount = 0;

    const scrollableHostObservable = cmp.watchScrollableHost();

    scrollableHostObservable.pipe(take(2)).subscribe((scrollableHost) => {
      if (obserableCount === 0) {
        expect(scrollableHost).toBe(cmp.parent.nativeElement);
        cmp.isParentScrollable = false;
        obserableCount++;
        fixture.detectChanges();
      } else {
        expect(scrollableHost).toBe(window);
        done();
      }
    });
  });

  // Using `done` here as with just `async` the test runner is moving the content when it shouldn't
  // which causes issues with finding the parent correctly.
  it('should update observable with new scrollable parent when it changes via a style change', (done) => {
    cmp.isParentScrollable = false;
    fixture.detectChanges();

    let obserableCount = 0;

    const scrollableHostObservable = cmp.watchScrollableHost();

    scrollableHostObservable.pipe(take(2)).subscribe((scrollableHost) => {
      if (obserableCount === 0) {
        expect(scrollableHost).toBe(window);
        cmp.isParentScrollableStyle = true;
        obserableCount++;
        fixture.detectChanges();
      } else {
        expect(scrollableHost).toBe(cmp.parent.nativeElement);
        done();
      }
    });
  });

  // Using `done` here as with just `async` the test runner is moving the content when it shouldn't
  // which causes issues with finding the parent correctly.
  it('should update observable with new scrollable parent when parent is hidden using a class with "display: none"', (done) => {
    let obserableCount = 0;

    const scrollableHostObservable = cmp.watchScrollableHost();

    scrollableHostObservable.pipe(take(2)).subscribe((scrollableHost) => {
      if (obserableCount === 0) {
        expect(scrollableHost).toBe(cmp.parent.nativeElement);
        cmp.isParentDisplayNoneClass = true;
        obserableCount++;
        fixture.detectChanges();
      } else {
        expect(scrollableHost).toBeUndefined();
        done();
      }
    });
  });

  // Using `done` here as with just `async` the test runner is moving the content when it shouldn't
  // which causes issues with finding the parent correctly.
  it('should update observable with new scrollable parent when parent is hidden using "display: none" directly', (done) => {
    let obserableCount = 0;

    const scrollableHostObservable = cmp.watchScrollableHost();

    scrollableHostObservable.pipe(take(2)).subscribe((scrollableHost) => {
      if (obserableCount === 0) {
        expect(scrollableHost).toBe(cmp.parent.nativeElement);
        cmp.isParentDisplayNoneStyle = true;
        obserableCount++;
        fixture.detectChanges();
      } else {
        expect(scrollableHost).toBeUndefined();
        done();
      }
    });
  });

  // Using `done` here as with just `async` the test runner is moving the content when it shouldn't
  // which causes issues with finding the parent correctly.
  it('should update observable with new scrollable parent when parent is hidden using the "hidden" attribute', (done) => {
    let obserableCount = 0;

    const scrollableHostObservable = cmp.watchScrollableHost();

    scrollableHostObservable.pipe(take(2)).subscribe((scrollableHost) => {
      if (obserableCount === 0) {
        expect(scrollableHost).toBe(cmp.parent.nativeElement);
        cmp.isParentHidden = true;
        obserableCount++;
        fixture.detectChanges();
      } else {
        expect(scrollableHost).toBeUndefined();
        done();
      }
    });
  });

  it('should only setup the mutation observer once for multiple observations of the scrollable host', (done) => {
    let observable1Count = 0;
    let observable2Count = 0;
    const testUnsubscribe: Subject<void> = new Subject();

    const scrollableHostObservable = cmp.watchScrollableHost();

    const mutationObserverSvc = TestBed.inject(MutationObserverService);

    spyOn(mutationObserverSvc, 'create').and.callThrough();

    scrollableHostObservable
      .pipe(takeUntil(testUnsubscribe))
      .subscribe((scrollableHost) => {
        if (observable1Count === 0) {
          expect(scrollableHost).toBe(cmp.parent.nativeElement);

          if (observable2Count === 1) {
            cmp.isParentScrollable = false;
          }

          fixture.detectChanges();
          observable1Count++;
        } else {
          expect(scrollableHost).toBe(window);
          observable1Count++;

          if (observable1Count === 2 && observable2Count === 2) {
            testUnsubscribe.next();
            done();
          }
        }
      });

    scrollableHostObservable
      .pipe(takeUntil(testUnsubscribe))
      .subscribe((scrollableHost) => {
        if (observable2Count === 0) {
          expect(scrollableHost).toBe(cmp.parent.nativeElement);

          if (observable1Count === 1) {
            cmp.isParentScrollable = false;
          }

          fixture.detectChanges();
          observable2Count++;
        } else {
          expect(scrollableHost).toBe(window);
          observable2Count++;

          if (observable1Count === 2 && observable2Count === 2) {
            testUnsubscribe.next();
            done();
          }
        }
      });

    // Should have been called once to the document observer and once for the parent observer
    expect(mutationObserverSvc.create).toHaveBeenCalledTimes(2);
  });

  it('should unsubscribe from watching the scrollable host correctly', (done) => {
    let observable1Count = 0;
    let observable2Count = 0;

    const scrollableHostObservable = cmp.watchScrollableHost();

    const disconnectSpy = spyOn(
      MutationObserver.prototype,
      'disconnect'
    ).and.callThrough();

    const subscription1 = scrollableHostObservable
      .pipe(take(2), delay(10))
      .subscribe((scrollableHost) => {
        if (observable1Count === 0) {
          expect(scrollableHost).toBe(cmp.parent.nativeElement);

          if (observable2Count === 1) {
            subscription1.unsubscribe();
            subscription2.unsubscribe();

            cmp.isParentScrollable = false;
            fixture.detectChanges();
            done();
          }

          fixture.detectChanges();
          observable1Count++;
        } else {
          fail('each subscription should only be hit once');
        }
      });

    // Disconnect is called via the setup as we use a shared method any time we set up the observer.
    expect(MutationObserver.prototype.disconnect).toHaveBeenCalledTimes(1);
    disconnectSpy.calls.reset();

    const subscription2 = scrollableHostObservable
      .pipe(take(2), delay(10))
      .subscribe((scrollableHost) => {
        if (observable2Count === 0) {
          expect(scrollableHost).toBe(cmp.parent.nativeElement);

          if (observable1Count === 1) {
            subscription1.unsubscribe();
            subscription2.unsubscribe();

            cmp.isParentScrollable = false;
            fixture.detectChanges();
            done();
          }

          fixture.detectChanges();
          observable2Count++;
        } else {
          fail('each subscription should only be hit once');
        }
      });
  });

  it('should disconnect from mutation observers correctly when all subscriptions are completed', () => {
    const scrollableHostObservable = cmp.watchScrollableHost();

    const disconnectSpy = spyOn(
      MutationObserver.prototype,
      'disconnect'
    ).and.callThrough();

    const subscription1 = scrollableHostObservable
      .pipe(take(2), delay(10))
      .subscribe(() => {
        return;
      });

    // Disconnect is called via the setup as we use a shared method any time we set up the observer.
    expect(MutationObserver.prototype.disconnect).toHaveBeenCalledTimes(1);
    disconnectSpy.calls.reset();

    const subscription2 = scrollableHostObservable
      .pipe(take(2), delay(10))
      .subscribe(() => {
        return;
      });

    subscription1.unsubscribe();
    subscription2.unsubscribe();

    fixture.detectChanges();

    // Should disconnect both the document observer and the parent observer
    expect(MutationObserver.prototype.disconnect).toHaveBeenCalledTimes(2);
  });

  it('should return all scroll events from the current scrollable host when they are subscribed to', (done) => {
    let obserableCount = 0;
    const scrollObservable = cmp.watchScrollableHostScrollEvents();

    scrollObservable.pipe(take(2)).subscribe(() => {
      if (obserableCount === 0) {
        obserableCount++;
        fixture.detectChanges();

        SkyAppTestUtility.fireDomEvent(cmp.parent.nativeElement, 'scroll', {
          bubbles: false,
        });
      } else {
        done();
      }
    });

    SkyAppTestUtility.fireDomEvent(cmp.parent.nativeElement, 'scroll', {
      bubbles: false,
    });
  });

  it('should notifify a subscriber when the scrollable parent changes via style changes when watching for scroll events', (done) => {
    let obserableCount = 0;
    const scrollObservable = cmp.watchScrollableHostScrollEvents();

    scrollObservable.pipe(take(2)).subscribe(() => {
      if (obserableCount === 0) {
        obserableCount++;
        fixture.detectChanges();

        cmp.isParentScrollable = false;
        cmp.isGrandparentScrollable = true;
        fixture.detectChanges();
      } else {
        done();
      }
    });

    SkyAppTestUtility.fireDomEvent(cmp.parent.nativeElement, 'scroll', {
      bubbles: false,
    });
  });

  it('should notifify a subscriber when the scrollable parent changes via content being moved when watching for scroll events', (done) => {
    let obserableCount = 0;
    const scrollObservable = cmp.watchScrollableHostScrollEvents();

    scrollObservable.pipe(take(2)).subscribe(() => {
      if (obserableCount === 0) {
        obserableCount++;
        fixture.detectChanges();

        cmp.moveTarget();
        fixture.detectChanges();
      } else {
        done();
      }
    });

    SkyAppTestUtility.fireDomEvent(cmp.parent.nativeElement, 'scroll', {
      bubbles: false,
    });
  });

  it('should return all scroll events from a new scrollable host if it changes', (done) => {
    let observableCount = 0;
    cmp.isGrandparentScrollable = true;

    const scrollObservable = cmp.watchScrollableHostScrollEvents();

    scrollObservable.pipe(take(4)).subscribe(async () => {
      if (observableCount === 0) {
        observableCount++;
        cmp.isParentScrollable = false;
        fixture.detectChanges();
        await fixture.whenStable();
      } else if (observableCount === 1) {
        observableCount++;
        fixture.detectChanges();
        await fixture.whenStable();
        SkyAppTestUtility.fireDomEvent(
          cmp.grandparent.nativeElement,
          'scroll',
          { bubbles: false }
        );
        fixture.detectChanges();
        await fixture.whenStable();
      } else if (observableCount === 2) {
        observableCount++;
        SkyAppTestUtility.fireDomEvent(cmp.parent.nativeElement, 'scroll', {
          bubbles: false,
        });
        fixture.detectChanges();
        done();
      } else {
        fail(
          'observable should only be hit 3 times - second parent scroll should not fire observable'
        );
      }
    });

    SkyAppTestUtility.fireDomEvent(cmp.parent.nativeElement, 'scroll');
  });

  it('should only setup the scrollable host observer once for multiple observations of the scroll events', (done) => {
    let observable1Count = 0;
    let observable2Count = 0;
    const testUnsubscribe: Subject<void> = new Subject();

    const scrollObservable = cmp.watchScrollableHostScrollEvents();

    const scrollableHostSvc = TestBed.inject(SkyScrollableHostService);

    spyOn(scrollableHostSvc, 'watchScrollableHost').and.callThrough();

    scrollObservable.pipe(takeUntil(testUnsubscribe)).subscribe(() => {
      if (observable1Count === 0) {
        observable1Count++;
        if (observable2Count === 1) {
          SkyAppTestUtility.fireDomEvent(cmp.parent.nativeElement, 'scroll', {
            bubbles: false,
          });
        }
      } else {
        observable1Count++;

        if (observable1Count === 2 && observable2Count === 2) {
          testUnsubscribe.next();
          done();
        }
      }
    });

    scrollObservable.pipe(takeUntil(testUnsubscribe)).subscribe(() => {
      if (observable2Count === 0) {
        observable2Count++;
        if (observable1Count === 1) {
          SkyAppTestUtility.fireDomEvent(cmp.parent.nativeElement, 'scroll', {
            bubbles: false,
          });
        }
      } else {
        observable2Count++;

        if (observable1Count === 2 && observable2Count === 2) {
          testUnsubscribe.next();
          done();
        }
      }
    });

    SkyAppTestUtility.fireDomEvent(cmp.parent.nativeElement, 'scroll');
    expect(scrollableHostSvc.watchScrollableHost).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe from watching the scrollable host correctly', (done) => {
    let observable1Count = 0;
    let observable2Count = 0;

    const scrollObservable = cmp.watchScrollableHostScrollEvents();

    const subscription1 = scrollObservable
      .pipe(take(2), delay(10))
      .subscribe(() => {
        if (observable1Count === 0) {
          if (observable2Count === 1) {
            subscription1.unsubscribe();
            subscription2.unsubscribe();

            SkyAppTestUtility.fireDomEvent(cmp.parent.nativeElement, 'scroll');

            fixture.detectChanges();

            cmp.isGrandparentScrollable = true;
            cmp.isParentScrollable = false;

            fixture.detectChanges();

            SkyAppTestUtility.fireDomEvent(
              cmp.grandparent.nativeElement,
              'scroll'
            );

            done();
          }

          fixture.detectChanges();
          observable1Count++;
        } else {
          fail('each subscription should only be hit once');
        }
      });

    const subscription2 = scrollObservable
      .pipe(take(2), delay(10))
      .subscribe(() => {
        if (observable2Count === 0) {
          if (observable1Count === 1) {
            subscription1.unsubscribe();
            subscription2.unsubscribe();

            SkyAppTestUtility.fireDomEvent(cmp.parent.nativeElement, 'scroll');

            fixture.detectChanges();

            cmp.isGrandparentScrollable = true;
            cmp.isParentScrollable = false;

            fixture.detectChanges();

            SkyAppTestUtility.fireDomEvent(
              cmp.grandparent.nativeElement,
              'scroll'
            );

            done();
          }

          fixture.detectChanges();
          observable2Count++;
        } else {
          fail('each subscription should only be hit once');
        }
      });

    SkyAppTestUtility.fireDomEvent(cmp.parent.nativeElement, 'scroll');
  });
});
