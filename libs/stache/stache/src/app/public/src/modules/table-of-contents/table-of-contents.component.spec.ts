import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';
import { StacheTableOfContentsComponent } from './table-of-contents.component';
import { StacheWindowRef } from '../shared';
import { StacheNavLink } from '../nav';

describe('StacheTableOfContentsComponent', () => {
  let component: StacheTableOfContentsComponent;
  let fixture: ComponentFixture<StacheTableOfContentsComponent>;
  let mockWindowService: any;

  class MockWindowService {
    public nativeWindow = {
      document: {
        documentElement: {
          getBoundingClientRect: () => {
            return { bottom: 100 };
          },
          querySelector: () => {
            return this.testElement;
          }
        }
      },
      innerHeight: 100,
      pageYOffset: 400
    };

    public testElement = {
      offsetTop: 100
    };
  }

  const route: StacheNavLink = {
    name: 'string',
    path: '/test',
    offsetTop: 100,
    isCurrent: false
  };

  beforeEach(() => {
    mockWindowService = new MockWindowService();

    TestBed.configureTestingModule({
      declarations: [
        StacheTableOfContentsComponent
      ],
      imports: [
        RouterTestingModule
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ],
      providers: [
        { provide: StacheWindowRef, useValue: mockWindowService }
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

  it('should detect changes after init', () => {
    const spy = spyOn((component as any).cdr, 'markForCheck');
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should scroll, route offset <= page offset', () => {
    mockWindowService.nativeWindow.innerHeight = undefined;
    component.ngAfterViewInit();
    component.onScroll();
    expect(component['activeRoute']).toEqual(route);

    mockWindowService.nativeWindow.innerHeight = 100;
  });

  it('should scroll, multiple routes', () => {
    component.routes.push({
      name: 'any',
      path: '/test2',
      offsetTop: 200,
      isCurrent: false
    });
    component.onScroll();
    expect(component['documentBottom']).toEqual(100);
    expect(component['window'].innerHeight).toEqual(100);
    expect(component['activeRoute']).toEqual(component.routes[1]);
    expect(component.routes[1].isCurrent).toBeTruthy();
  });

  it('should scroll, end of page', () => {
    component.onScroll();
    expect(component['documentBottom']).toEqual(100);
    expect(component['window'].innerHeight).toEqual(100);
    expect(component['activeRoute']).toEqual(route);
    expect(route.isCurrent).toBeTruthy();
  });
});
