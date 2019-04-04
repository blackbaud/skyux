import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';
import { StacheTableOfContentsComponent } from './table-of-contents.component';
import { StacheNavLink } from '../nav';
import { Observable } from 'rxjs';
import { StacheWindowRef, StacheOmnibarAdapterService } from '../shared';

class MockWindowService {
  public testElement = {
    offsetTop: 20,
    getBoundingClientRect() {
      return {
        y: 0,
        bottom: 0
      };
    },
    scrollIntoView() {
      return;
    }
  };

  public nativeWindow = {
    pageYOffset: 0,
    innerHeight: 0,
    document: {
      getElementById: jasmine.createSpy('getElementById').and.callFake((id: any) => {
        if (id === 'element-id') {
          return this.testElement;
        }
        return false;
      }),
      querySelector: jasmine.createSpy('querySelector').and.callFake((selector: any) => {
        return this.testElement;
      }),
      documentElement: this.testElement
    },
    location: {
      href: ''
    },
    scroll: jasmine.createSpy('scroll')
  };

  public scrollEventStream = Observable.of(true);
}

class MockOmnibarService {
  public getHeight = () => 50;
}

describe('StacheTableOfContentsComponent', () => {
  let component: StacheTableOfContentsComponent;
  let fixture: ComponentFixture<StacheTableOfContentsComponent>;
  let mockWindowRef: any;
  let mockOmnibarService: any;

  const route: StacheNavLink = {
    name: 'string',
    path: '/test',
    offsetTop: 100,
    isCurrent: false
  };

  beforeEach(() => {
    mockWindowRef = new MockWindowService();
    mockOmnibarService = new MockOmnibarService();

    TestBed.configureTestingModule({
      declarations: [
        StacheTableOfContentsComponent
      ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        { provide: StacheWindowRef, useValue: mockWindowRef },
        { provide: StacheOmnibarAdapterService, useValue: mockOmnibarService }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheTableOfContentsComponent);
    component = fixture.componentInstance;
    component.routes = [route];
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should not update view when no routes are provided', () => {
    spyOn(component, 'updateView');
    component.updateRoutesOnScroll([]);
    expect(component.updateView).not.toHaveBeenCalled();
  });

  it('should update routes on scroll', () => {
    spyOn(component, 'updateView');
    component.updateRoutesOnScroll([
      {
        name: 'testRoute',
        path: [],
        offsetTop: 0
      } as StacheNavLink
    ]);
    expect(component.updateView).toHaveBeenCalled();
  });

  it('should update the route show current status when scrolled to bottom of view', () => {
    const routes = [
      {
        name: 'testRoute',
        path: [],
        offsetTop: 0
      } as StacheNavLink
    ];

    component.updateView(routes);

    expect(routes[0].isCurrent).toBeTruthy();
    expect(component['documentBottom']).toBe(0);
  });

  it('should display the first route as the current route when scrolled', () => {
    const test = {
      offsetTop: 20,
      getBoundingClientRect() {
        return {
          y: 0,
          bottom: 150
        };
      },
      scrollIntoView() {
        return;
      }
    };
    mockWindowRef = {
      testElement: test,
      nativeWindow: {
        pageYOffset: 0,
        innerHeight: 0,
        document: {
          getElementById: jasmine.createSpy('getElementById').and.callFake((id: any) => {
            if (id === 'element-id') {
              return test;
            }
            return false;
          }),
          querySelector: jasmine.createSpy('querySelector').and.callFake((selector: any) => {
            return test;
          }),
          documentElement: test
        },
        location: {
          href: ''
        },
        scroll: jasmine.createSpy('scroll')
      },
      scrollEventStream: Observable.of(true)
    };

    component = new StacheTableOfContentsComponent(mockWindowRef as any, mockOmnibarService as any);

    const routes = [
      {
        name: 'testRoute0',
        path: [],
        offsetTop: 10
      } as StacheNavLink,
      {
        name: 'testRoute1',
        path: [],
        offsetTop: 100
      } as StacheNavLink
    ];

    component.updateView(routes);

    expect(routes[0].isCurrent).toBeTruthy();
    expect(routes[1].isCurrent).not.toBeTruthy();
  });

  it('should display the second route as the current route when scrolled', () => {
    const test = {
      offsetTop: 20,
      getBoundingClientRect() {
        return {
          y: 0,
          bottom: 150
        };
      },
      scrollIntoView() {
        return;
      }
    };
    mockWindowRef = {
      testElement: test,
      nativeWindow: {
        pageYOffset: 200,
        innerHeight: 200,
        document: {
          getElementById: jasmine.createSpy('getElementById').and.callFake((id: any) => {
            if (id === 'element-id') {
              return test;
            }
            return false;
          }),
          querySelector: jasmine.createSpy('querySelector').and.callFake((selector: any) => {
            return test;
          }),
          documentElement: test
        },
        location: {
          href: ''
        },
        scroll: jasmine.createSpy('scroll')
      },
      scrollEventStream: Observable.of(true)
    };

    component = new StacheTableOfContentsComponent(mockWindowRef as any, mockOmnibarService as any);

    const routes = [
      {
        name: 'testRoute0',
        path: [],
        offsetTop: 10
      } as StacheNavLink,
      {
        name: 'testRoute1',
        path: [],
        offsetTop: 100
      } as StacheNavLink
    ];

    component['viewTop'] = 250;
    component['isCurrent'](routes);

    expect(routes[0].isCurrent).not.toBeTruthy();
    expect(routes[1].isCurrent).toBeTruthy();
  });
});
