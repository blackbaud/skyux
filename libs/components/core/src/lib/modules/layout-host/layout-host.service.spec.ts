import { TestBed } from '@angular/core/testing';

import { SkyLayoutHostService } from './layout-host.service';

describe('Layout host service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkyLayoutHostService],
    });
  });

  it('should update layout for child', () => {
    const layoutHostSvc = TestBed.inject(SkyLayoutHostService);

    const handler = jasmine.createSpy('handler');
    layoutHostSvc.hostLayoutForChild.subscribe(handler);

    layoutHostSvc.setHostLayoutForChild({
      layout: 'tabs',
    });

    expect(handler).toHaveBeenCalledOnceWith({
      layout: 'tabs',
    });
  });
});
