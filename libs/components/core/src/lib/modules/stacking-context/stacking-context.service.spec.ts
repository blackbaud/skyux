import { TestBed } from '@angular/core/testing';

import { SkyStackingContextService } from './stacking-context.service';

describe('StackingContextService', () => {
  let service: SkyStackingContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkyStackingContextService);
  });

  it('should create z-index value', () => {
    const zIndex = service.getZIndex('flyout');
    expect(zIndex).toBeTruthy();
    const zIndex2 = service.getZIndex('flyout');
    expect(zIndex2).toEqual(zIndex + 1000);
    expect(() => service.unsetZIndex(zIndex)).not.toThrow();
  });
});
