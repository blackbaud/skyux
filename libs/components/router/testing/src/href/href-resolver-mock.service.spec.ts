import { TestBed } from '@angular/core/testing';
import { SkyHrefTestingModule } from './href-testing.module';

import { SkyHrefResolverMockService } from './href-resolver-mock.service';

describe('SkyNavHrefResolverMockService', () => {
  let service: SkyHrefResolverMockService;

  it('should be created', async () => {
    TestBed.configureTestingModule({
      imports: [SkyHrefTestingModule],
    });
    service = TestBed.inject(SkyHrefResolverMockService);
    expect(service).toBeTruthy();
    expect(service.resolveHref).toBeTruthy();
    expect(await service.resolveHref({ url: 'test' })).toEqual({
      url: 'test',
      userHasAccess: true,
    });
  });

  it('should be created with options', async () => {
    TestBed.configureTestingModule({
      imports: [SkyHrefTestingModule.with({ userHasAccess: false })],
    });
    service = TestBed.inject(SkyHrefResolverMockService);
    expect(service).toBeTruthy();
    expect(service.resolveHref).toBeTruthy();
    expect(await service.resolveHref({ url: 'test' })).toEqual({
      url: 'test',
      userHasAccess: false,
    });
  });
});
