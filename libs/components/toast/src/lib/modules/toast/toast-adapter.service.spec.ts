// #region imports
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SkyToastAdapterService } from './toast-adapter.service';

// #endregion

describe('Toast adapter service', () => {
  let adapter: SkyToastAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkyToastAdapterService],
    });

    adapter = TestBed.inject(SkyToastAdapterService);
  });

  it('should scroll to the bottom of an element correctly', fakeAsync(() => {
    const elementRefMock = {
      nativeElement: {
        scrollTop: 0,
        scrollHeight: 40,
      },
    };

    adapter.scrollBottom(elementRefMock);
    tick();

    expect(elementRefMock.nativeElement.scrollTop).toBe(40);
  }));
});
