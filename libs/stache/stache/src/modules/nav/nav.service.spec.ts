import { Router, NavigationStart, NavigationEnd } from '@angular/router';

import { Observable } from 'rxjs';

import { StacheNavService } from './nav.service';

class MockSkyAppConfig {
  public runtime: any = {
    routes: [
      {
        routePath: ''
      },
      {
        routePath: 'parent'
      },
      {
        routePath: 'parent/child'
      },
      {
        routePath: 'parent/child/grandchild'
      },
      {
        routePath: 'parent/child/grandchild/grand-grandchild'
      },
      {
        routePath: 'other-route'
      },
      {
        routePath: 'other-parent'
      },
      {
        routePath: 'other-parent/other-child'
      },
      {
        routePath: 'other-parent/other-child/other-grandchild'
      }
    ]
  };
  public skyux: any = {};
}

class MockRouter {
  public url = '/parent/child/grandchild';
  public events = Observable.of(new NavigationStart(0, ''));
}

describe('StacheNavService', () => {
  let navService: StacheNavService;
  let skyAppConfig: MockSkyAppConfig;
  let router: MockRouter;

  beforeEach(() => {
    skyAppConfig = new MockSkyAppConfig();
    router = new MockRouter();
    navService = new StacheNavService(skyAppConfig, router as Router);
  });

  it('should only assemble the active routes once', () => {
    let activeRoutes = navService.getActiveRoutes();
    expect(activeRoutes[0].children.length).toBe(1);

    skyAppConfig.runtime.routes = [];
    activeRoutes = navService.getActiveRoutes();
    expect(activeRoutes[0].children.length).toBe(1);
  });

  it('should only unset the active routes on NavigationStart', () => {
    router.events = Observable.of(new NavigationEnd(0, '', ''));
    spyOn(StacheNavService.prototype, 'clearActiveRoutes');
    navService = new StacheNavService(skyAppConfig, router as Router);
    expect(StacheNavService.prototype.clearActiveRoutes).not.toHaveBeenCalled();
  });

  it('should return the active URL', () => {
    let url = navService.getActiveUrl();
    expect(url).toBe(router.url);
  });

  it('should order routes in hierarchies', () => {
    let activeRoutes = navService.getActiveRoutes();
    expect(activeRoutes[0].path).toBe('/parent');
    expect(activeRoutes[0].children[0].path).toBe('/parent/child');
    expect(activeRoutes[0].children[0].children[0].path).toBe('/parent/child/grandchild');
  });

  it('should create the route\'s name from the path', () => {
    let activeRoutes = navService.getActiveRoutes();
    expect(activeRoutes[0].name).toBe('Parent');
    expect(activeRoutes[0].children[0].name).toBe('Child');
    expect(activeRoutes[0].children[0].children[0].name).toBe('Grandchild');
  });
});
