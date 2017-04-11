import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheNavComponent } from './nav.component';

describe('StacheNavComponent', () => {
  let component: StacheNavComponent;
  let fixture: ComponentFixture<StacheNavComponent>;
  let debugElement: DebugElement;
  let mockRouter: any;

  class MockRouter {
    public navigate = jasmine.createSpy('navigate');
    public url = '/test';
  }

  beforeEach(() => {
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      declarations: [ StacheNavComponent ],
      providers: [{ provide: Router, useValue: mockRouter }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheNavComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
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
    component.routes = [{
      name: 'Test',
      path: '/test',
      children: [{
        name: 'Child', path: '/test/child'
      }]
    },
    {
      name: 'No Child',
      path: '/no-child'
    }];

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
    component.routes = [{ name: 'Test', path: '/test', fragment: 'Test' }];
    const route = component.routes[0];

    fixture.detectChanges();

    component.navigate(route);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/test'], { fragment: 'Test' });
  });

  it('should set the classname based on the navType on init', () => {
    component.navType = 'sidebar';
    component.ngOnInit();

    fixture.detectChanges();

    expect(component.classname).toBe('stache-nav-sidebar');
  });
});
