import {
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  STACHE_ROUTE_METADATA_SERVICE_CONFIG
} from './route-metadata-service-config-token';

import {
  StacheRouteMetadataService
} from './route-metadata.service';

describe('StacheRouteMetadataService', () => {
  let routeMetadataService: StacheRouteMetadataService;
  let config: any[] = [
    {
      path: '/',
      name: 'foo',
      order: '1'
    },
    {
      path: '/',
      name: 'bar'
    },
    {
      path: '/one',
      name: 'one',
      order: '-100'
    },
    {
      path: '/two',
      name: 'two',
      order: 0
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        {
          provide: STACHE_ROUTE_METADATA_SERVICE_CONFIG,
          useValue: config
        },
        {
          provide: StacheRouteMetadataService,
          useClass: StacheRouteMetadataService
        }
      ]
    })
    .compileComponents();

    routeMetadataService = new StacheRouteMetadataService(config);
  });

  it('should have a routes property', () => {
    expect(routeMetadataService.metadata).toBeDefined();
  });

  it('should convert values to appropriate type', () => {
    expect(typeof routeMetadataService.metadata[0].order).toBe('number');
    expect(typeof routeMetadataService.metadata[0].name).toBe('string');
  });

  it('should remove the order attribute for non valid inputs', () => {
    expect(routeMetadataService.metadata[2].order).toBe(undefined);
    expect(routeMetadataService.metadata[0].order).toBe(1);
    expect(routeMetadataService.metadata[3].order).toBe(undefined);
  });
});
