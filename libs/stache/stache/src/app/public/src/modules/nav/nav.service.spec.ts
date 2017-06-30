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
        routePath: 'order-routes'
      },
      {
        routePath: 'order-routes/first'
      },
      {
        routePath: 'order-routes/first/order-one'
      },
      {
        routePath: 'order-routes/first/order-two'
      },
      {
        routePath: 'order-routes/first/order-three'
      },
      {
        routePath: 'order-routes/first/order-four'
      },
      {
        routePath: 'order-routes/first/order-five'
      },
      {
        routePath: 'order-routes/first/sample'
      },
      {
        routePath: 'order-routes/first/sample-two'
      },
      {
        routePath: 'order-routes/third'
      },
      {
        routePath: 'order-routes/second'
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
  public metadata: any[] = [
      {
        path: 'other-parent',
        name: 'Custom Route Name'
      },
      {
        path: 'order-routes/first',
        name: 'A First'
      },
      {
        path: 'order-routes/third',
        name: 'C Third'
      },
      {
        path: 'order-routes/second',
        name: 'B Second'
      },
      {
        path: 'order-routes/first/order-two',
        order: 2,
        name: 'B Three'
      },
      {
        path: 'order-routes/first/order-one',
        order: 1
      },
      {
        path: 'order-routes/first/order-five',
        name: 'A'
      },
      {
        path: 'order-routes/first/order-three',
        order: 3,
        name: 'B Three'
      },
      {
        path: 'order-routes/first/sample',
        order: 4,
        name: 'A Three'
      },
      {
        path: 'order-routes/first/order-four',
        order: 3,
        name: 'A Three'
      },
      {
        path: 'order-routes/first/sample-two',
        order: 5,
        name: 'A Three'
      }
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
    delete routeMetadataService.metadata;
    let activeRoutes = navService.getActiveRoutes();
    expect(activeRoutes[0].name).toBe('Parent');
  });

  it('should order routes alphabetically by name', () => {
    router.url = '/order-routes';
    let activeRoutes = navService.getActiveRoutes();
    expect(activeRoutes[0].children[0].name).toBe('A First');
    expect(activeRoutes[0].children[2].name).toBe('C Third');
  });

  it('should order routes by order over alphabetical if order exists', () => {
    router.url = '/order-routes';
    let activeRoutes = navService.getActiveRoutes();
    expect(activeRoutes[0].children[0].children[0].name).toBe('Order One');
    expect(activeRoutes[0].children[0].children[2].name).toBe('A Three');
    expect(activeRoutes[0].children[0].children[2].order).toBe(3);
    expect(activeRoutes[0].children[0].children[3].name).toBe('B Three');
    expect(activeRoutes[0].children[0].children[3].order).toBe(3);
    expect(activeRoutes[0].children[0].children[6].name).toBe('A');
  });
});
