import { Router, NavigationStart, NavigationEnd } from '@angular/router';

import { Observable } from 'rxjs';

import { StacheNavService } from './nav.service';
import { StacheConfigService, StacheRouteMetadataService } from '../shared';

class MockStacheConfigService {
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

class MockStacheRouteMetadataService {
  public routes: any[] = [
    { path: 'other-parent', name: 'Custom Route Name' }
  ];
}

describe('StacheNavService', () => {
  let navService: StacheNavService;
  let configService: MockStacheConfigService;
  let router: MockRouter;
  let routeMetadataService: MockStacheRouteMetadataService;

  beforeEach(() => {
    configService = new MockStacheConfigService();
    router = new MockRouter();
    routeMetadataService = new MockStacheRouteMetadataService();

    navService = new StacheNavService(
      router as Router,
      configService as StacheConfigService,
      routeMetadataService as StacheRouteMetadataService
    );
  });

  it('should only assemble the active routes once', () => {
    let activeRoutes = navService.getActiveRoutes();
    expect(activeRoutes[0].children.length).toBe(1);

    configService.runtime.routes = [];
    activeRoutes = navService.getActiveRoutes();
    expect(activeRoutes[0].children.length).toBe(1);
  });

  it('should only unset the active routes on NavigationStart', () => {
    router.events = Observable.of(new NavigationEnd(0, '', ''));
    spyOn(StacheNavService.prototype, 'clearActiveRoutes');
    navService = new StacheNavService(
      router as Router,
      configService as StacheConfigService,
      routeMetadataService as StacheRouteMetadataService
    );
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

  it('should create the route\'s name from the path by default', () => {
    let activeRoutes = navService.getActiveRoutes();
    expect(activeRoutes[0].name).toBe('Parent');
    expect(activeRoutes[0].children[0].name).toBe('Child');
    expect(activeRoutes[0].children[0].children[0].name).toBe('Grandchild');
  });

  it('should use the route\'s name provided in route metadata service', () => {
    router.url = '/other-parent';
    let activeRoutes = navService.getActiveRoutes();
    expect(activeRoutes[0].name).toBe('Custom Route Name');
  });

  it('should handle an undefined routes property in route metadata service', () => {
    delete routeMetadataService.routes;
    let activeRoutes = navService.getActiveRoutes();
    expect(activeRoutes[0].name).toBe('Parent');
  });
});
