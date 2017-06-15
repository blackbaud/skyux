import { TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import {
  StacheRouteMetadataService,
  STACHE_ROUTE_METADATA_SERVICE_CONFIG
} from './index';

describe('StacheRouteMetadataService', () => {
  let routeMetadataService: StacheRouteMetadataService;
  let config: any[] = [];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: STACHE_ROUTE_METADATA_SERVICE_CONFIG, useValue: config },
        { provide: StacheRouteMetadataService, useClass: StacheRouteMetadataService }
      ]
    })
    .compileComponents();

    routeMetadataService = new StacheRouteMetadataService(config);
  });

  it('should have a routes property', () => {
    expect(routeMetadataService.routes).toBeDefined();
  });
});
