import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RouterTestingModule } from '@angular/router/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheBreadcrumbsComponent } from './breadcrumbs.component';
import { StacheNavComponent, StacheNavService } from '../nav';
import {
  StacheConfigService,
  StacheWindowRef,
  StacheRouteService,
  StacheRouteMetadataService } from '../shared';
import { StacheLinkModule } from '../link';

describe('StacheBreadcrumbsComponent', () => {
  let component: StacheBreadcrumbsComponent;
  let fixture: ComponentFixture<StacheBreadcrumbsComponent>;

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

  let mockActiveUrl = '';

  class MockRouteService {
    public getActiveRoutes() {
      return mockRoutes;
    }
    public getActiveUrl() {
      return mockActiveUrl;
    }
  }

  class MockStacheConfigService {
    public runtime: any = {
      routes: mockRoutes
    };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheNavComponent,
        StacheBreadcrumbsComponent
      ],
      imports: [
        RouterTestingModule,
        StacheLinkModule
      ],
      providers: [
        StacheNavService,
        StacheWindowRef,
        { provide: StacheRouteService, useClass: MockRouteService },
        { provide: StacheConfigService, useClass: MockStacheConfigService },
        { provide: StacheRouteMetadataService, useValue: { routes: [] } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheBreadcrumbsComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should only have one route on base root path', () => {
    component.routes = undefined;
    mockActiveUrl = '';
    mockRoutes = [
      {
        path: '',
        children: []
      }
    ];
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.stache-nav-anchor'));

    expect(links.length).toBe(1);
  });

  it('should display navigation links', () => {
    component.routes = [
      { name: 'Test 1', path: [] },
      { name: 'Test 2', path: [] }
    ];

    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.stache-nav-anchor'));

    expect(links.length).toBe(2);
  });

  it('should generate child routes from SkyAppConfig', () => {
    mockActiveUrl = '/parent/child';
    mockRoutes = [
      {
        path: 'parent',
        children: [{
          path: 'parent/child',
          children: [{
            path: 'parent/child/grandchild',
            children: []
          }]
        }]
      }
    ];
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.routes.length).toBe(3);
  });

  it('should not generate routes beyond the current path', () => {
    mockActiveUrl = '/parent/child';
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.routes.length).toBe(3);
  });

  it('should generate grandchild routes from SkyAppConfig', () => {
    mockActiveUrl = '/parent/child/grandchild';
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.routes.length).toBe(4);
  });

  it('should add a link to the home page', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.routes[0].name).toBe('Home');
  });
});
