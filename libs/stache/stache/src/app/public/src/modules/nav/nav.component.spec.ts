import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheNavComponent } from './nav.component';
import { StacheNavTestComponent } from './fixtures/nav.component.fixture';
import { StacheWindowRef } from '../shared';

describe('StacheNavComponent', () => {
  let component: StacheNavComponent;
  let fixture: ComponentFixture<StacheNavComponent>;
  let mockRouter: any;

  class MockRouter {
    public navigate = jasmine.createSpy('navigate');
    public url = '/test';
  }

  beforeEach(() => {
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      declarations: [
        StacheNavComponent,
        StacheNavTestComponent
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        StacheWindowRef
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheNavComponent);
    component = fixture.componentInstance;
  });

  it('should have the given inputs', () => {
    component.routes = [{ name: 'Test', path: '/test' }];
    component.navType = 'sidebar';

    fixture.detectChanges();

    expect(component.routes[0].name).toBe('Test');
    expect(component.navType).toBe('sidebar');
  });

  it('should return true if the component has routes', () => {
    component.routes = [{ name: 'Test', path: '/test' }];

    fixture.detectChanges();

    expect(component.hasRoutes()).toBe(true);
  });

  it('should return false if the component has no routes', () => {
    component.routes = [];

    fixture.detectChanges();

    expect(component.hasRoutes()).toBe(false);
  });

  it('should return true if a given route has child routes', () => {
    component.routes = [
      {
        name: 'Test',
        path: '/test',
        children: [
          { name: 'Child', path: '/test/child' }
        ]
      },
      { name: 'No Child', path: '/no-child' }
    ];

    const route = component.routes[0];
    const route2 = component.routes[1];

    fixture.detectChanges();

    expect(component.hasChildRoutes(route)).toBe(true);
    expect(component.hasChildRoutes(route2)).toBe(false);
  });

  it('should return true if a given route is active', () => {
    component.routes = [{ name: 'Test', path: '/test' }];
    const route = component.routes[0];

    fixture.detectChanges();

    expect(component.isActive(route)).toBe(true);
  });

  it('should return true if a given route is current', () => {
    component.routes = [{ name: 'Test', path: '/test' }];
    const route = component.routes[0];

    fixture.detectChanges();

    expect(component.isCurrent(route)).toBe(true);
  });

  it('should navigate to the route passed in', () => {
    component.routes = [{ name: 'Test', path: '/test' }];
    const route = component.routes[0];

    fixture.detectChanges();
    component.navigate(route);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/test'], {});
  });

  it('should navigate to the route if passed an array', () => {
    component.routes = [{ name: 'Test', path: ['/', 'test'] }];
    const route = component.routes[0];

    fixture.detectChanges();
    component.navigate(route);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/', 'test'], {});
  });

  it('should navigate to a hash if given an anchor route', () => {
    mockRouter.url = '/test#heading';
    component.routes = [{ name: 'Test', path: '/test#heading' }];
    const route = component.routes[0];

    fixture.detectChanges();
    component.navigate(route);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/test#heading'], {});
  });

  it('should pass in a fragment with the route if provided', () => {
    spyOn(component, 'scrollToElement');
    component.routes = [{ name: 'Test', path: '/test', fragment: 'Test' }];
    const route = component.routes[0];

    fixture.detectChanges();
    component.navigate(route);

    expect(component.scrollToElement).toHaveBeenCalled();
  });

  it('should set the classname based on the navType on init', () => {
    component.navType = 'sidebar';

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.classname).toBe('stache-nav-sidebar');
  });

  it('should call scrollToElement if a fragment is passed in', () => {
    let testFixture = TestBed.createComponent(StacheNavTestComponent);
    let testComponent = fixture.componentInstance;
    let target = testFixture.nativeElement.querySelector('#some-header');

    spyOn(target, 'scrollIntoView');

    testComponent.routes = [{ name: 'Some Header', path: '/test', fragment: 'some-header' }];
    testFixture.detectChanges();
    component.navigate(testComponent.routes[0]);

    expect(target.scrollIntoView).toHaveBeenCalled();
  });

  it('should not call scrollToElement if the fragment does not match an element ID', () => {
    let testFixture = TestBed.createComponent(StacheNavTestComponent);
    let testComponent = fixture.componentInstance;
    let target = testFixture.nativeElement.querySelector('#some-header');

    spyOn(target, 'scrollIntoView');

    testComponent.routes = [{ name: '', path: '', fragment: 'invalid-fragment' }];
    testFixture.detectChanges();
    component.navigate(testComponent.routes[0]);

    expect(target.scrollIntoView).not.toHaveBeenCalled();
  });
});
