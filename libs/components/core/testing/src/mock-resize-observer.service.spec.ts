import { TestBed } from '@angular/core/testing';

import { MockSkyResizeObserverService } from './mock-resize-observer.service';

describe('MockSkyResizeObserverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockSkyResizeObserverService],
    });
  });

  it('should be created', () => {
    const service = TestBed.inject(MockSkyResizeObserverService);
    expect(service).toBeTruthy();
  });

  it('should be provide mocks', () => {
    const service = TestBed.inject(MockSkyResizeObserverService);
    let lastEntry: ResizeObserverEntry | undefined;
    const element = { nativeElement: document.body };
    const subscription = service
      .observe(element)
      .subscribe((entry) => (lastEntry = entry));
    service.mockEmit(element, {
      contentRect: { width: 100, height: 100 },
    } as ResizeObserverEntry);
    expect(lastEntry).toEqual({
      contentRect: { width: 100, height: 100 },
    } as ResizeObserverEntry);
    subscription.unsubscribe();
  });
});
