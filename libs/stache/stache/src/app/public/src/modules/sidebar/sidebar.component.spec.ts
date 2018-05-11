import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheSidebarComponent } from './sidebar.component';
import { StacheNavComponent, StacheNavService } from '../nav';

import {
  StacheWindowRef,
  StacheRouteMetadataService,
  StacheRouteService
} from '../shared';

import { RouterLinkStubDirective } from './fixtures/router-link-stub.directive';
import { StacheLinkModule } from '../link';

describe('StacheSidebarComponent', () => {
  let component: StacheSidebarComponent;
  let fixture: ComponentFixture<StacheSidebarComponent>;
  let mockRouteService: any;
  let activeUrl: string = '/';

  let routes = [
    {
      name: 'Home',
      path: '',
      children: [
        {
          name: 'Test',
          path: '/test',
          children: [
            {
              name: 'Test Child',
              path: '/test/child'
            }
          ]
        }
      ]
    }
  ];

  class MockRouteService {
    public getActiveUrl() {
      return activeUrl;
    }

    public getActiveRoutes() {
      return routes;
    }
  }

  beforeEach(() => {
    mockRouteService = new MockRouteService();

    TestBed.configureTestingModule({
      declarations: [
        StacheNavComponent,
        StacheSidebarComponent,
        RouterLinkStubDirective
      ],
      imports: [
        RouterTestingModule,
        StacheLinkModule
      ],
      providers: [
        StacheWindowRef,
        StacheNavService,
        StacheRouteService,
        { provide: StacheRouteService, useValue: mockRouteService },
        { provide: StacheRouteMetadataService, useValue: { routes: [] } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheSidebarComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
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

  it('should automatically generate routes from config', () => {
    component.routes = undefined;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.routes.length).toBe(1);
    expect(component.routes[0].children.length).toBe(1);
  });

  it('should add add a heading for the root level route', () => {
    fixture.detectChanges();
    expect(component.heading).toEqual('Home');
    expect(component.headingRoute).toEqual('/');
  });

  it('should automatically add a link to the top-level page', () => {
    fixture.detectChanges();
    expect(component.routes[0].name).toBe('Test');
  });
});
