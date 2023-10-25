import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';

import {
  mockResizeObserver,
  mockResizeObserverEntry,
  mockResizeObserverHandle,
} from './fixtures/resize-observer-mock';
import { ResizeObserverScheduler } from './resize-observer-scheduler';
import { SkyResizeObserverService } from './resize-observer.service';

describe('ResizeObserver service', async () => {
  let resizeObserverScheduler: Subject<void>;

  beforeAll(() => {
    mockResizeObserver();
    resizeObserverScheduler = new Subject<void>();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ResizeObserverScheduler,
          useValue: resizeObserverScheduler,
        },
      ],
    });
  });

  afterAll(() => {
    resizeObserverScheduler.complete();
  });

  it('should return a new instance of a resize observer', async () => {
    const service = TestBed.inject(SkyResizeObserverService);
    expect(service).toBeTruthy();
    service.ngOnDestroy();
  });

  it('should observe an element resize', async () => {
    const nativeElement = document.createElement('div');
    document.body.appendChild(nativeElement);
    const target = new ElementRef(nativeElement);
    let result: ResizeObserverEntry | undefined;
    const service = TestBed.inject(SkyResizeObserverService);
    const subscription = service
      .observe(target)
      .subscribe((resizeObserverEntry) => {
        result = { ...resizeObserverEntry };
      });
    expect(result).toBeFalsy();
    mockResizeObserverHandle.emit([
      {
        ...mockResizeObserverEntry,
        target: target.nativeElement,
      },
    ]);
    resizeObserverScheduler.next();
    expect(result).toEqual({
      ...mockResizeObserverEntry,
      target: target.nativeElement,
    });
    subscription.unsubscribe();
    nativeElement.remove();
  });

  it('should handle multiple observers', async () => {
    const nativeElement = document.createElement('div');
    document.body.appendChild(nativeElement);
    const target = new ElementRef(nativeElement);
    let result: ResizeObserverEntry | undefined;
    const service = TestBed.inject(SkyResizeObserverService);
    const subscription1 = service
      .observe(target)
      .subscribe((resizeObserverEntry) => {
        result = { ...resizeObserverEntry };
      });
    const subscription2 = service
      .observe(target)
      .subscribe((resizeObserverEntry) => {
        result = { ...resizeObserverEntry };
      });
    expect(result).toBeFalsy();
    mockResizeObserverHandle.emit([
      {
        ...mockResizeObserverEntry,
        target: target.nativeElement,
      },
    ]);
    resizeObserverScheduler.next();
    expect(result).toEqual({
      ...mockResizeObserverEntry,
      target: target.nativeElement,
    });
    subscription1.unsubscribe();
    subscription2.unsubscribe();
    nativeElement.remove();
  });

  it('should handle empty entry list', async () => {
    const nativeElement = document.createElement('div');
    document.body.appendChild(nativeElement);
    const target = new ElementRef(nativeElement);
    const service = TestBed.inject(SkyResizeObserverService);
    const subscriber = jasmine.createSpy('subscriber');
    const subscription = service.observe(target).subscribe(subscriber);
    expect(subscriber).not.toHaveBeenCalled();
    resizeObserverScheduler.next();
    expect(subscriber).toHaveBeenCalledTimes(1);
    subscriber.calls.reset();
    mockResizeObserverHandle.emit([]);
    resizeObserverScheduler.next();
    expect(subscriber).not.toHaveBeenCalled();
    subscription.unsubscribe();
    nativeElement.remove();
  });
});
