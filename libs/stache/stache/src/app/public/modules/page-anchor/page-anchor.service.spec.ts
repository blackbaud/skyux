import {
  BehaviorSubject,
  Subject
} from 'rxjs';

import {
  StachePageAnchorService
} from './page-anchor.service';

import {
  StacheNavLink
} from '../nav/nav-link';

class MockWindowRef {
  private mockPageAnchors: StacheNavLink[] = [
    {
      name: 'test',
      path: '/'
    }
  ];

  public nativeWindow = {
    document: {
      querySelectorAll: jasmine.createSpy('querySelectorAll').and.callFake((id: any) => {
        return this.mockPageAnchors;
      }),
      body: {
        scrollHeight: 5
      }
    },
    addEventListener: (eventType: string, func: any) => {
      func();
    }
  };

  public scrollEventStream = new BehaviorSubject(0);

  public testElement = {
    getBoundingClientRect() {
      return { y: 0 };
    }
  };
}

describe('PageAnchorService', () => {
  let service: StachePageAnchorService;
  let windowRef = new MockWindowRef();

  beforeEach(() => {
    service = new StachePageAnchorService(
      (windowRef as any)
    );
  });

  it('should request page anchors update when body height changes', () => {
    spyOn(service, 'refreshAnchors').and.callThrough();
    service['windowRef'].nativeWindow.document.body.scrollHeight = 1;
    const event: any = service['windowRef'].scrollEventStream;
    event.next(1);
    event.next(1);

    expect(service.refreshAnchors).toHaveBeenCalled();
  });

  it('should be destroyed', () => {
    spyOn<any>(service['ngUnsubscribe'], 'complete');
    service.ngOnDestroy();
    expect(service['ngUnsubscribe'].complete).toHaveBeenCalled();
  });

  it('should not add an anchor when unsubscribe', () => {
    const anchorStream = new BehaviorSubject({
      name: 'Test Anchor',
      path: '/'
    });
    service.addAnchor(anchorStream);
    service.ngOnDestroy();

    expect(service.pageAnchors).toEqual([]);
  });

  it('should add an anchor', () => {
    const anchorStream = new BehaviorSubject({
      name: 'Test Anchor',
      path: '/'
    });
    service.addAnchor(anchorStream);

    expect(service.pageAnchors).toEqual([anchorStream]);
  });

  it('should remove anchor', () => {
    const anchor0 = new BehaviorSubject({
      name: 'b',
      path: '/'
    });
    const anchor1 = new BehaviorSubject({
      name: 'a',
      path: '/'
    });

    service.pageAnchors = [anchor0, anchor1];

    service['removeAnchor'](anchor0.getValue());

    const result: any[] = [anchor1];
    expect(service.pageAnchors).toEqual(result);
  });

  it('should update anchor stream', () => {
    const anchor0 = new BehaviorSubject({
      name: 'b',
      path: '/'
    });
    const anchor1 = new BehaviorSubject({
      name: 'a',
      path: '/'
    });

    service.pageAnchors = [anchor0, anchor1];
    service['updateAnchorStream']();

    const result = new Subject<StacheNavLink[]>();
    result.next([anchor1.getValue(), anchor0.getValue()]);
    expect(service['pageAnchorsStream']).toEqual(result);
  });
});
