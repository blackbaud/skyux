import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { expect, SkyAppTestModule } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheSidebarComponent } from './sidebar.component';
import { StacheNavService } from '../nav/nav.service';

import {
  StacheWindowRef,
  StacheRouteMetadataService,
  StacheRouteService
} from '../shared';

import { RouterLinkStubDirective } from './fixtures/router-link-stub.directive';
import { SidebarTestComponent } from './fixtures/sidebar-test.component.fixture';
import { StacheSidebarModule } from './sidebar.module';

const routes = [
  {
    name: 'Home',
    path: '/home',
    children: [
      {
        name: 'Test',
        path: '/test',
        children: [
          {
            name: 'Test Child',
            path: '/test/child'
          },
          {
            name: 'Test Child2',
            path: '/test/child'
          }
        ]
      }
    ]
  }
];

describe('StacheSidebarComponent', () => {
  let component: StacheSidebarComponent;
  let fixture: ComponentFixture<StacheSidebarComponent>;
  let mockRouteService: any;
  let activeUrl: string = '/';

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
        SidebarTestComponent,
        RouterLinkStubDirective
      ],
      imports: [
        RouterTestingModule,
        StacheSidebarModule,
        SkyAppTestModule
      ],
      providers: [
        StacheWindowRef,
        StacheNavService,
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
      {
        name: 'Header',
        path: '/',
        children: [
          { name: 'Test 1', path: [] },
          { name: 'Test 2', path: [] }
        ]
      }
    ];

    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.stache-nav-anchor'));

    expect(links.length).toBe(2);
  });

  it('should automatically generate routes from config', () => {
    const tmpFixture = TestBed.createComponent(SidebarTestComponent);
    tmpFixture.detectChanges();

    const links = tmpFixture.debugElement.queryAll(By.css('.stache-nav-anchor'));

    expect(links.length).toBe(3);
  });

  it('should add a \/ to a heading route when one is not present', () => {
    component.routes = [
      {
        name: 'Header',
        path: '',
        children: []
      }
    ];

    expect(component.heading).toEqual('Header');
    expect(component.headingRoute).toEqual('/');
  });

  it('should not add a \/ to a heading route when one is present', () => {
    component.routes = [
      {
        name: 'Header',
        path: '/',
        children: []
      }
    ];

    expect(component.heading).toEqual('Header');
    expect(component.headingRoute).toEqual('/');
  });

  it('should handle header paths if the path is an array', () => {
    component.routes = [
      {
        name: 'Foo',
        path: ['home', 'foo'],
        children: []
      }
    ];

    expect(component.heading).toEqual('Foo');
    expect(component.headingRoute).toEqual('/home/foo');
  });

  it('should use generated routes if no custom routes are provided', () => {
    const tmpFixture = TestBed.createComponent(SidebarTestComponent);
    tmpFixture.detectChanges();
    const heading: HTMLAnchorElement = tmpFixture.nativeElement.querySelector('#stache-sidebar-heading');
    expect(heading.innerHTML.trim()).toEqual('Home');
  });

  it('should not use generated routes if custom routes are provided', () => {
    const tmpFixture = TestBed.createComponent(SidebarTestComponent);
    const cmp = tmpFixture.componentInstance as SidebarTestComponent;

    cmp.routes = [
      {
        name: 'Foo',
        path: ['home', 'foo'],
        children: []
      }
    ];

    tmpFixture.detectChanges();

    const el = tmpFixture.nativeElement as HTMLElement;

    const sidebarHeading = el.querySelector('#stache-sidebar-heading').innerHTML;

    expect(sidebarHeading.trim()).toEqual('Foo');
  });

  it('should get sidebar routes', () => {
    component.routes = [
      {
        name: 'Header',
        path: '/',
        children: [
          { name: 'Test 1', path: [] },
          { name: 'Test 2', path: [] }
        ]
      }
    ];

    expect(component.routes.length).toBe(1);
  });
});
