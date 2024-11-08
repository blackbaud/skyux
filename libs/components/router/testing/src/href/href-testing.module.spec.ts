import { TestBed } from '@angular/core/testing';
import { SkyHrefResolverService } from '@skyux/router';

import { SkyHrefResolverMockService } from './href-resolver-mock.service';
import { SkyHrefTestingModule } from './href-testing.module';

describe('SkyHrefTestingModule', () => {
  it('should be created', async () => {
    TestBed.configureTestingModule({
      imports: [SkyHrefTestingModule],
    });
    const service = TestBed.inject(SkyHrefResolverService);
    expect(service).toBeTruthy();
    expect(service).toBeInstanceOf(SkyHrefResolverMockService);
    expect(await service.resolveHref({ url: 'test' })).toEqual({
      url: 'test',
      userHasAccess: true,
    });
  });

  it('should set user access for resolver', async () => {
    TestBed.configureTestingModule({
      imports: [SkyHrefTestingModule.with({ userHasAccess: false })],
    });
    const service = TestBed.inject(SkyHrefResolverService);
    expect(service).toBeTruthy();
    expect(service).toBeInstanceOf(SkyHrefResolverMockService);
    expect(await service.resolveHref({ url: 'test' })).toEqual({
      url: 'test',
      userHasAccess: false,
    });
  });
});
