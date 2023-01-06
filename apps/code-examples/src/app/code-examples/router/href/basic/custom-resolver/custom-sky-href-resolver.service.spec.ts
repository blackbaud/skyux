import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CustomSkyHrefResolverService } from './custom-sky-href-resolver.service';

describe('CustomSkyHrefResolverService', () => {
  let service: CustomSkyHrefResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomSkyHrefResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a link as-is', () => {
    const url = 'https://www.blackbaud.com';
    const result = service.resolveHref({ url });
    result.then((href) => {
      expect(href.url).toEqual(url);
      expect(href.userHasAccess).toEqual(true);
    });
  });

  it('should return a link with allow protocol', () => {
    const url = 'allow://www.blackbaud.com';
    const result = service.resolveHref({ url });
    result.then((href) => {
      expect(href.url).toEqual('https://www.blackbaud.com');
      expect(href.userHasAccess).toEqual(true);
    });
  });

  it('should return a link with deny protocol', () => {
    const url = 'deny://www.blackbaud.com';
    const result = service.resolveHref({ url });
    result.then((href) => {
      expect(href.url).toEqual(url);
      expect(href.userHasAccess).toEqual(false);
    });
  });

  it('should return a link with slow protocol', fakeAsync(() => {
    const url = 'slow://www.blackbaud.com';
    const result = service.resolveHref({ url });
    result.then((href) => {
      expect(href.url).toEqual('https://www.blackbaud.com');
      expect(href.userHasAccess).toEqual(true);
    });
    tick(3000);
  }));

  it('should return a link with unknown protocol', () => {
    const url = 'unknown://www.blackbaud.com';
    const result = service.resolveHref({ url });
    result.then((href) => {
      expect(href.url).toEqual(url);
      expect(href.userHasAccess).toEqual(false);
    });
  });
});
