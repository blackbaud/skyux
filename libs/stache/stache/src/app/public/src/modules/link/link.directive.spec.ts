import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheRouterLinkDirective } from './link.directive';
import { StacheRouterLinkTestComponent } from './fixtures/link.component.fixture';
import { StacheNavService } from '../nav/nav.service';
import { StacheRouteService, StacheWindowRef } from '../../..';
import { LocationStrategy } from '@angular/common';
import { StacheRouterLinkTestLocalRouteComponent } from './fixtures/link.component_localroute.fixture';

describe('StacheLinkDirective', () => {
  let component: StacheRouterLinkTestComponent;
  let debugElement: DebugElement;
  let directiveElement: any;
  let fixture: ComponentFixture<StacheRouterLinkTestComponent>;
  let mockNavService: any;
  let mockRouteService: any;
  let path: string;
  let fragment: string;

  class MockNavService {
    public navigate = jasmine.createSpy('navigate').and.callFake((routeObj: any) => {
      path = routeObj.path;
      fragment = routeObj.fragment;
    });

    public isExternal(route: any): boolean {
      let testPath = route;

      if (typeof testPath !== 'string') {
        return false;
      }
      return /^(https?|mailto|ftp):+|^(www)/.test(testPath);
    }
  }

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

  beforeEach(() => {
    mockNavService = new MockNavService();
    mockRouteService = new MockRouteService();

    TestBed.configureTestingModule({
      declarations: [
        StacheRouterLinkDirective,
        StacheRouterLinkTestComponent,
        StacheRouterLinkTestLocalRouteComponent
      ],
      providers: [
        LocationStrategy,
        StacheWindowRef,
        { provide: StacheNavService, useValue: mockNavService },
        { provide: StacheRouteService, useValue: mockRouteService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StacheRouterLinkTestComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.directive(StacheRouterLinkDirective));
    debugElement = fixture.debugElement;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should have a route input', () => {
    const directiveInstance = directiveElement.injector.get(StacheRouterLinkDirective);
    fixture.detectChanges();
    expect(directiveInstance.stacheRouterLink).toBe('test-route');
  });

  it('should have a fragment input', () => {
    const directiveInstance = directiveElement.injector.get(StacheRouterLinkDirective);
    fixture.detectChanges();
    expect(directiveInstance.fragment).toBe('test');
  });

  it('should call the navigate method when clicked', async(() => {
    const directiveInstance = directiveElement.injector.get(StacheRouterLinkDirective);
    spyOn(directiveInstance, 'navigate');
    const link = debugElement.nativeElement.querySelector('a');
    link.click();
    fixture.whenStable()
      .then(() => {
        expect(directiveInstance.navigate).toHaveBeenCalled();
      });
  }));

  it('should set stacheRouterLink input to internal urls', async(() => {
    fixture = TestBed.createComponent(StacheRouterLinkTestLocalRouteComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.directive(StacheRouterLinkDirective));

    const directiveInstance = directiveElement.injector.get(StacheRouterLinkDirective);
    directiveInstance.stacheRouterLink = '/demos';
    directiveInstance.ngAfterViewInit();
    expect(directiveInstance._stacheRouterLink).toBe('/demos');
  }));

  it('should set stacheRouterLink input to same page urls', async(() => {
    mockActiveUrl = '/test-page';
    fixture = TestBed.createComponent(StacheRouterLinkTestLocalRouteComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.directive(StacheRouterLinkDirective));

    const directiveInstance = directiveElement.injector.get(StacheRouterLinkDirective);
    directiveInstance.stacheRouterLink = '.';
    expect(directiveInstance._stacheRouterLink).toBe('/test-page');
    mockActiveUrl = '';
  }));

  it('should set stacheRouterLink input to external urls', async(() => {
    fixture = TestBed.createComponent(StacheRouterLinkTestLocalRouteComponent);
    component = fixture.componentInstance;
    directiveElement = fixture.debugElement.query(By.directive(StacheRouterLinkDirective));

    const directiveInstance = directiveElement.injector.get(StacheRouterLinkDirective);
    directiveInstance.stacheRouterLink = 'https://www.google.com';
    directiveInstance.ngAfterViewInit();
    expect(directiveInstance._stacheRouterLink).toBe('https://www.google.com');
  }));

  it('should open in new window when shift clicked', async(() => {
    const event = new KeyboardEvent('click', {shiftKey : true});
    const link = debugElement.nativeElement.querySelector('a');
    link.dispatchEvent(event);
    expect(mockNavService.navigate).not.toHaveBeenCalled();
  }));

  it('should open in new window when meta (command) clicked', async(() => {
    const event = new KeyboardEvent('click', {metaKey : true});
    const link = debugElement.nativeElement.querySelector('a');
    link.dispatchEvent(event);
    expect(mockNavService.navigate).not.toHaveBeenCalled();
  }));

  it('should pass the fragment to the navigate method if it exists', () => {
    const event = new Event('click');
    const directiveInstance = directiveElement.injector.get(StacheRouterLinkDirective);
    fixture.detectChanges();
    directiveInstance.navigate(event);
    expect(mockNavService.navigate).toHaveBeenCalledWith({
      path: 'test-route',
      fragment: 'test'
    });
  });

  it('should not pass a fragment if it does not exist', () => {
    const event = new Event('click');
    const directiveInstance = directiveElement.injector.get(StacheRouterLinkDirective);
    fixture.detectChanges();
    directiveInstance.fragment = undefined;
    directiveInstance.navigate(event);
    expect(mockNavService.navigate).toHaveBeenCalledWith({
      path: 'test-route',
      fragment: undefined
    });
  });
});
