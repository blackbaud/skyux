import {
  ComponentFixture,
  TestBed,
  async,
  tick,
  fakeAsync
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  BehaviorSubject,
  Subscription
} from 'rxjs';

import {
  SidebarFixtureComponent
} from './fixtures/sidebar.component.fixture';

import {
  SidebarFixtureModule
} from './fixtures/sidebar.module.fixture';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

describe('Sidebar', () => {
  let component: SidebarFixtureComponent;
  let fixture: ComponentFixture<SidebarFixtureComponent>;
  let mediaQueryService: any;

  const mockConfig: any = {
    runtime: {
      routes: [
        {
          routePath: '/home'
        }
      ]
    },
    skyux: {}
  };

  class MockMediaQueryService {
    public current = SkyMediaBreakpoints.md;
    private currentSubject = new BehaviorSubject<SkyMediaBreakpoints>(this.current);

    public subscribe(listener: any): Subscription {
      return this.currentSubject.subscribe((value) => {
        listener(value);
      });
    }
  }

  function detectChanges(): void {
    fixture.detectChanges();
    tick();
  }

  function getToggleButton(): any {
    return fixture.nativeElement.querySelector('.stache-sidebar-button');
  }

  function getHeadingElement(): any {
    return fixture.nativeElement.querySelector('.stache-sidebar-heading');
  }

  function verifyOpened(): void {
    expect(fixture.nativeElement.querySelector('.stache-sidebar-open')).toBeTruthy();
    expect(fixture.componentInstance.sidebarWrapperComponent.sidebarOpen).toEqual(true);
  }

  function verifyClosed(): void {
    expect(fixture.nativeElement.querySelector('.stache-sidebar-closed')).toBeTruthy();
    expect(fixture.componentInstance.sidebarWrapperComponent.sidebarOpen).toEqual(false);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SidebarFixtureModule
      ],
      providers: [
        {
          provide: SkyAppConfig,
          useValue: mockConfig
        },
        {
          provide: SkyMediaQueryService,
          useClass: MockMediaQueryService
        }
      ]
    });

    fixture = TestBed.createComponent(SidebarFixtureComponent);
    component = fixture.componentInstance;
    mediaQueryService = TestBed.get(SkyMediaQueryService);
  });

  it('should set defaults', fakeAsync(() => {
    detectChanges();

    const sidebar = component.sidebarWrapperComponent;

    expect(sidebar.elementId).toBeDefined();
    expect(sidebar.sidebarLabel).toEqual('Click to open sidebar');
    expect(sidebar.sidebarOpen).toEqual(true);
    expect(sidebar.sidebarRoutes).toBeUndefined();
  }));

  it('should display navigation links', fakeAsync(() => {
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

    detectChanges();

    const links = fixture.nativeElement.querySelectorAll('.stache-nav-anchor');

    expect(links.length).toBe(2);
  }));

  it('should support array route paths', fakeAsync(() => {
    component.routes = [
      {
        name: 'Header',
        path: ['foo', 'bar', 'baz']
      }
    ];

    detectChanges();

    const heading = getHeadingElement();
    const anchor = heading.querySelector('a');

    expect(anchor.getAttribute('href')).toEqual('/foo/bar/baz');
  }));

  it('should add a \/ to a heading route when one is not present', fakeAsync(() => {
    component.routes = [
      {
        name: 'Header',
        path: '',
        children: []
      }
    ];

    detectChanges();

    const heading = getHeadingElement();
    const anchor = heading.querySelector('a');

    expect(heading.textContent.trim()).toEqual('Header');
    expect(anchor.getAttribute('href')).toEqual('/');
  }));

  it('should not add a \/ to a heading route when one is present', fakeAsync(() => {
    component.routes = [
      {
        name: 'Header',
        path: '/',
        children: []
      }
    ];

    detectChanges();

    const heading = getHeadingElement();
    const anchor = heading.querySelector('a');

    expect(heading.textContent.trim()).toEqual('Header');
    expect(anchor.getAttribute('href')).toEqual('/');
  }));

  it('should allow an external heading route', fakeAsync(() => {
    component.routes = [
      {
        name: 'Header',
        path: 'https://example.org',
        children: []
      }
    ];

    detectChanges();

    const heading = getHeadingElement();
    const anchor = heading.querySelector('a');

    expect(heading.textContent.trim()).toEqual('Header');
    expect(anchor.getAttribute('href')).toEqual('https://example.org');
  }));

  it('should open and close the sidebar', fakeAsync(() => {
    detectChanges();

    verifyOpened();

    const button = getToggleButton();
    button.click();
    detectChanges();

    verifyClosed();
  }));

  it('should add a CSS class to the body', fakeAsync(() => {
    detectChanges();

    expect(document.body.className.indexOf('stache-sidebar-enabled') > -1).toEqual(true);
  }));

  it('should remove the CSS class from the body on destroy', fakeAsync(() => {
    detectChanges();

    expect(document.body.className.indexOf('stache-sidebar-enabled') > -1).toEqual(true);

    fixture.destroy();

    expect(document.body.className.indexOf('stache-sidebar-enabled') > -1).toEqual(false);
  }));

  it('should be accessible', async(() => {
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement).toBeAccessible();
  }));

  it('should collapse the sidebar on small screens', fakeAsync(() => {
    detectChanges();

    verifyOpened();

    mediaQueryService.currentSubject.next(SkyMediaBreakpoints.xs);

    detectChanges();

    verifyClosed();
  }));
});
