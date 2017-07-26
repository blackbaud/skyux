import { StacheNavService } from './nav.service';

class MockRouter {
  public url = '/internal#element-id';
  public navigate = (path: any, extras: any) => true;
}

class MockWindowService {
  public nativeWindow = {
    document: {
        getElementById: jasmine.createSpy('getElementById').and.callFake((id: any) => {
          if (id === 'element-id') {
            return this.testElement;
          }
          return false;
        })
    },
    setTimeout: jasmine.createSpy('setTimeout').and.callFake(function(callback: any) {
      return callback();
    }),
    location: {
      href: '',
      hash: ''
    },
    scroll: jasmine.createSpy('scroll')
  };
  public testElement = {
    scrollIntoView: jasmine.createSpy('scrollIntoView')
  };
}

describe('StacheNavService', () => {
  let navService: StacheNavService;
  let windowRef: MockWindowService;
  let router: MockRouter;

  beforeEach(() => {
    router = new MockRouter();
    windowRef = new MockWindowService();
    navService = new StacheNavService((router as any), (windowRef as any));
  });

  it('should return true if a given route is external www', () => {
    let www = navService['isExternal']({path: 'www.external.com'});
    expect(www).toBe(true);
  });

  it('should return true if a given route is external http', () => {
    let isHttp = navService['isExternal']({path: 'http://www.external.com'});
    expect(isHttp).toBe(true);
  });

  it('should return true if a given route is external mailto', () => {
    let mailto = navService['isExternal']({path: 'mailto:test@email.com'});
    expect(mailto).toBe(true);
  });

  it('should return true if a given route is external ftp', () => {
    let ftp = navService['isExternal']({path: 'ftp://address'});
    expect(ftp).toBe(true);
  });

  it('should return false if a given route is not external', () => {
    let isExternal = navService['isExternal']('/internal-route');
    expect(isExternal).toBe(false);
  });

  it('should return false if no path is present', () => {
    let noPath = navService['isExternal']({});
    expect(noPath).toBe(false);
  });

  it('should find an element by id and scroll to it when given a valid fragment', () => {
    navService['scrollToElement'](windowRef.testElement, 'element-id');
    expect(windowRef.testElement.scrollIntoView).toHaveBeenCalled();
  });

  it('should set the hash to the valid fragment when an element is found', () => {
    navService['scrollToElement'](windowRef.testElement, 'element-id');
    expect(windowRef.nativeWindow.location.hash).toEqual('element-id');
  });

  it('should not scroll to any element if no element is found', () => {
    navService['scrollToElement'](undefined, 'not-found');
    expect(windowRef.testElement.scrollIntoView).not.toHaveBeenCalled();
  });

  it('should navigate to an external url', () => {
    navService.navigate({path: 'www.external.com' });
    expect(windowRef.nativeWindow.location.href).toEqual('www.external.com');
  });

  it('should navigate to an internal url with a fragment', () => {
    navService.navigate({path: '/internal', fragment: 'element-id'});
    expect(windowRef.nativeWindow.location.hash).toEqual('element-id');
  });

  it('should navigate to an internal url and remove a fragment that doesn\'t exist on the page',
   () => {
    navService.navigate({path: 'internal', fragment: 'does-not-exist'});
    expect(windowRef.nativeWindow.location.hash).toEqual('');
    expect(windowRef.nativeWindow.scroll).toHaveBeenCalled();
  });
});
