import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { SkyAppConfig } from '@skyux/config';

import { of as observableOf } from 'rxjs';

import { StacheRouteMetadataService } from './route-metadata.service';
import { StacheRouteService } from './route.service';

class MockStacheConfigService {
  public runtime: any = {
    routes: [
      {
        routePath: '',
      },
      {
        routePath: 'order-routes',
      },
      {
        routePath: 'order-routes/first',
      },
      {
        routePath: 'order-routes/first/order-one',
      },
      {
        routePath: 'order-routes/first/order-two',
      },
      {
        routePath: 'order-routes/first/order-three',
      },
      {
        routePath: 'order-routes/first/order-four',
      },
      {
        routePath: 'order-routes/first/order-five',
      },
      {
        routePath: 'order-routes/first/sample',
      },
      {
        routePath: 'order-routes/first/sample-two',
      },
      {
        routePath: 'order-routes/first/hidden-child',
      },
      {
        routePath: 'order-routes/first/shown-child',
      },
      {
        routePath: 'order-routes/third',
      },
      {
        routePath: 'order-routes/second',
      },
      {
        routePath: 'order-routes/fourth',
      },
      {
        routePath: 'order-routes/shown-child',
      },
      {
        routePath: 'order-routes/hidden-child',
      },
      {
        routePath: 'parent',
      },
      {
        routePath: 'parent/child',
      },
      {
        routePath: 'parent/child/grandchild',
      },
      {
        routePath: 'parent/child/grandchild/grand-grandchild',
      },
      {
        routePath: 'other-parent',
      },
      {
        routePath: 'other-parent/other-child',
      },
      {
        routePath: 'other-parent/other-child/other-grandchild',
      },
      {
        routePath: 'testing-children',
      },
      {
        routePath: 'testing-children/child',
      },
      {
        routePath: 'testing-children1',
      },
      {
        routePath: 'testing-children1/child',
      },
      {
        routePath: 'testing-children2',
      },
      {
        routePath: 'testing-children2/child',
      },
    ],
  };
  public skyux: any = {};
}

class MockRouter {
  public url = '/parent/child/grandchild';
  public events = observableOf(new NavigationStart(0, ''));
}

class MockStacheRouteMetadataService {
  public metadata: any[] = [
    {
      path: 'other-parent',
      name: 'Custom Route Name',
    },
    {
      path: 'order-routes/first',
      name: 'A First',
    },
    {
      path: 'order-routes/hidden-child',
      showInNav: false,
      name: 'Z Hidden Route',
    },
    {
      path: 'order-routes/shown-child',
      showInNav: true,
      name: 'Z Shown route',
    },
    {
      path: 'order-routes/third',
      name: 'C Third',
    },
    {
      path: 'order-routes/second',
      name: 'B Second',
    },
    {
      path: 'order-routes/fourth',
      name: 'fourth route',
      order: 4,
    },
    {
      path: 'order-routes/first/order-two',
      order: 2,
      name: 'B Three',
    },
    {
      path: 'order-routes/first/order-one',
      order: 1,
    },
    {
      path: 'order-routes/first/order-five',
      name: 'A',
    },
    {
      path: 'order-routes/first/order-three',
      order: 3,
      name: 'B Three',
    },
    {
      path: 'order-routes/first/hidden-child',
      showInNav: false,
      name: 'Hidden grandchild route',
      order: 9999,
    },
    {
      path: 'order-routes/first/shown-child',
      showInNav: true,
      name: 'Shown grandchild route',
      order: 99999,
    },
    {
      path: 'order-routes/first/sample',
      order: 4,
      name: 'A Three',
    },
    {
      path: 'order-routes/first/order-four',
      order: 3,
      name: 'A Three',
    },
    {
      path: 'order-routes/first/sample-two',
      order: 999,
      name: 'A Three',
    },
  ];
}

describe('StacheRouteService', () => {
  let routeService: StacheRouteService;
  let configService: MockStacheConfigService;
  let router: MockRouter;
  let routeMetadataService: MockStacheRouteMetadataService;

  beforeEach(() => {
    configService = new MockStacheConfigService();
    router = new MockRouter();
    routeMetadataService = new MockStacheRouteMetadataService();

    routeService = new StacheRouteService(
      router as Router,
      configService as SkyAppConfig,
      routeMetadataService as StacheRouteMetadataService
    );
  });

  it('should not include child routes from similar parents (a, a1, a2)', () => {
    router.url = '/testing-children';
    let activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children.length).toBe(1);
  });

  it('should only assemble the active routes once', () => {
    let activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children.length).toBe(1);

    configService.runtime.routes = [];
    activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children.length).toBe(1);
  });

  it('should handle missing config.runtime', () => {
    delete configService.runtime;

    let activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children.length).toBe(0);
  });

  it('should only unset the active routes on NavigationStart', () => {
    router.events = observableOf(new NavigationEnd(0, '', ''));
    spyOn(StacheRouteService.prototype, 'clearActiveRoutes');
    routeService = new StacheRouteService(
      router as Router,
      configService as SkyAppConfig,
      routeMetadataService as StacheRouteMetadataService
    );
    expect(
      StacheRouteService.prototype.clearActiveRoutes
    ).not.toHaveBeenCalled();
  });

  it('should return the active URL', () => {
    let url = routeService.getActiveUrl();
    expect(url).toBe(router.url);
  });

  it('should order routes in hierarchies', () => {
    let activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].path).toBe('parent');
    expect(activeRoutes[0].children[0].path).toBe('parent/child');
    expect(activeRoutes[0].children[0].children[0].path).toBe(
      'parent/child/grandchild'
    );
  });

  it("should create the route's name from the path by default", () => {
    let activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].name).toBe('Parent');
    expect(activeRoutes[0].children[0].name).toBe('Child');
    expect(activeRoutes[0].children[0].children[0].name).toBe('Grandchild');
  });

  it("should use the route's name provided in route metadata service", () => {
    router.url = '/other-parent';
    let activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].name).toBe('Custom Route Name');
  });

  it('should handle an undefined routes property in route metadata service', () => {
    delete routeMetadataService.metadata;
    let activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].name).toBe('Parent');
  });

  it('should order routes alphabetically by name', () => {
    router.url = '/order-routes';
    let activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children[0].name).toBe('A First');
    expect(activeRoutes[0].children[2].name).toBe('C Third');
  });

  it('should filter out routes with showInNav: false', () => {
    router.url = '/order-routes';
    let activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children[0].name).toBe('A First');
    expect(activeRoutes[0].children[2].name).toBe('C Third');
    expect(activeRoutes[0].children).not.toContain({
      path: 'order-routes/hidden-child',
      children: [],
      name: 'Z Hidden Route',
      showInNav: false,
    });

    expect(activeRoutes[0].children).toContain({
      path: 'order-routes/shown-child',
      showInNav: true,
      name: 'Z Shown route',
      children: [],
    });
  });

  it('should arrange routes in their nav Order locations', () => {
    router.url = '/order-routes';
    let activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children[0].children[0].name).toBe('Order One');
    expect(activeRoutes[0].children[0].children[6].name).toBe('A Three');
  });

  it('should filter out all decendant routes containing showInNav: true', () => {
    router.url = '/order-routes';
    let activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children[0].children[0].name).toBe('Order One');
    expect(activeRoutes[0].children[0].children[6].name).toBe('A Three');
    expect(activeRoutes[0].children[0].children).not.toContain({
      path: 'order-routes/first/hidden-child',
      children: [],
      name: 'Hidden grandchild route',
      showInNav: true,
      order: 9999,
    });

    expect(activeRoutes[0].children[0].children).toContain({
      path: 'order-routes/first/shown-child',
      children: [],
      name: 'Shown grandchild route',
      showInNav: true,
      order: 99999,
    });
  });

  it('should order routes with the same navOrder alphabetically', () => {
    router.url = '/order-routes';
    let activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children[0].children[2].name).toBe('A Three');
    expect(activeRoutes[0].children[0].children[2].order).toBe(3);
    expect(activeRoutes[0].children[0].children[3].name).toBe('B Three');
    expect(activeRoutes[0].children[0].children[3].order).toBe(3);
  });

  it('should place routes in their assigned order, skipping non ordered routes', () => {
    router.url = '/order-routes';
    let activeRoutes = routeService.getActiveRoutes();
    expect(activeRoutes[0].children[0].children[5].name).toBe('A');
    expect(activeRoutes[0].children[0].children[5].order).toBe(undefined);
    expect(activeRoutes[0].children[0].children[6].name).toBe('A Three');
    expect(activeRoutes[0].children[0].children[6].order).toBe(999);
  });
});
