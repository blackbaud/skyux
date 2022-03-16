import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  NO_ERRORS_SCHEMA
} from '@angular/core';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  StacheLayoutContainerComponent
} from './layout-container.component';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  StacheLayoutModule
} from './layout.module';

import {
  StacheRouteService
} from '../router/route.service';

import {
  StacheRouteMetadataService
} from '../router/route-metadata.service';

let mockRoutes = [
  {
    path: '',
    children: [
      {
        path: 'parent',
        children: [
          {
            path: 'parent/child',
            children: [
              {
                path: 'parent/child/grandchild'
              }
            ]
          }
        ]
      }
    ]
  }
];

class MockSkyAppConfig {
  public runtime: any = {
    routes: mockRoutes
  };
}

class MockRouteService {
  public getActiveRoutes() {
    return mockRoutes;
  }
  public getActiveUrl() {
    return '';
  }
}

describe('StacheLayoutContainerComponent', () => {
  let component: StacheLayoutContainerComponent;
  let fixture: ComponentFixture<StacheLayoutContainerComponent>;
  let sampleRoutes = [{ name: 'test', path: '/test' }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StacheLayoutModule,
        RouterTestingModule
      ],
      providers: [
        { provide: StacheRouteService, useClass: MockRouteService },
        { provide: SkyAppConfig, useClass: MockSkyAppConfig },
        { provide: StacheRouteMetadataService, useValue: { routes: [] } }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheLayoutContainerComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should have a pageTitle input', () => {
    component.pageTitle = 'test';
    fixture.detectChanges();
    expect(component.pageTitle).toBe('test');
  });

  it('should have a breadcrumbsRoutes input', () => {
    component.breadcrumbsRoutes = sampleRoutes;
    fixture.detectChanges();
    expect(component.breadcrumbsRoutes.length).toBe(1);
  });

  it('should have an inPageRoutes input', () => {
    component.inPageRoutes = sampleRoutes;
    fixture.detectChanges();
    expect(component.inPageRoutes.length).toBe(1);
  });

  it('should have a showBackToTop input', () => {
    component.showBackToTop = true;
    fixture.detectChanges();
    expect(component.showBackToTop).toBe(true);
  });

  // This will allow documentation writers to not worry about proper attribute binding.
  it('should allow setting `showBackToTop` to string "true"', () => {
    (component as any).showBackToTop = 'true';
    fixture.detectChanges();
    expect(component.showBackToTop).toEqual(true);
  });

  it('should have a showBreadcrumbs input', () => {
    component.showBreadcrumbs = true;
    fixture.detectChanges();
    expect(component.showBreadcrumbs).toBe(true);
  });

  // This will allow documentation writers to not worry about proper attribute binding.
  it('should allow setting `showBreadcrumbs` to string "true"', () => {
    (component as any).showBreadcrumbs = 'true';
    fixture.detectChanges();
    expect(component.showBreadcrumbs).toEqual(true);
  });

  it('should have a showEditButton input', () => {
    component.showEditButton = true;
    fixture.detectChanges();
    expect(component.showEditButton).toBe(true);
  });

  // This will allow documentation writers to not worry about proper attribute binding.
  it('should allow setting `showEditButton` to string "true"', () => {
    (component as any).showEditButton = 'true';
    fixture.detectChanges();
    expect(component.showEditButton).toEqual(true);
  });

  it('should have a showTableOfContents input', () => {
    component.showTableOfContents = true;
    fixture.detectChanges();
    expect(component.showTableOfContents).toBe(true);
  });

  // This will allow documentation writers to not worry about proper attribute binding.
  it('should allow setting `showTableOfContents` to string "true"', () => {
    (component as any).showTableOfContents = 'true';
    fixture.detectChanges();
    expect(component.showTableOfContents).toEqual(true);
  });

});
