import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StachePageAnchorComponent } from './page-anchor.component';
import { StachePageAnchorService } from './page-anchor.service';

import { StacheWindowRef, StacheRouteService } from '../shared';

describe('StachePageAnchorComponent', () => {
  let component: StachePageAnchorComponent;
  let fixture: ComponentFixture<StachePageAnchorComponent>;
  let mockRouteService: any;
  let mockWindowService: any;
  let mockAnchorService: any;

  let activeUrl: string = '/';

  let mockPageAnchors = [
    {
      id: 'test-content'
    }
  ];

  class MockRouteService {
    public getActiveUrl() {
      return activeUrl;
    }
  }

  class MockAnchorService {
    public addPageAnchor = jasmine.createSpy('addPageAnchor').and.callFake((anchor: any) => {});
  }

  class MockWindowService {
    public nativeWindow = {
      document: {
        querySelector: jasmine.createSpy('querySelector').and.callFake((fragment: any) => {
            return this.testElement;
          }),
          querySelectorAll: jasmine.createSpy('querySelectorAll').and.callFake(() => {
            return mockPageAnchors;
          })
      },
      location: {
        href: ''
      }
    };

    public testElement = {
      scrollIntoView: jasmine.createSpy('scrollIntoView').and.callFake(() => {})
    };
  }

  beforeEach(() => {
    mockWindowService = new MockWindowService();
    mockRouteService = new MockRouteService();
    mockAnchorService = new MockAnchorService();

    TestBed.configureTestingModule({
      declarations: [
        StachePageAnchorComponent
      ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        { provide: StacheWindowRef, useValue: mockWindowService },
        { provide: StacheRouteService, useValue: mockRouteService },
        { provide: StachePageAnchorService, useValue: mockAnchorService },
        ChangeDetectorRef
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StachePageAnchorComponent);
    component = fixture.componentInstance;
    spyOn((component as any).cdRef, 'detectChanges').and.callFake(() => {});
    fixture.debugElement.nativeElement.textContent = 'Test Content';
  });

  it('should add the name from the element text content', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.name).toBe('Test Content');
  });

  it('should add the fragment from the component name', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.fragment).toBe('test-content');
  });

  it('should add the path from the route service', () => {
    const routeSpy = spyOn(mockRouteService, 'getActiveUrl').and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    expect(routeSpy).toHaveBeenCalled();
    expect(component.path).toEqual(['/']);
  });

  it('should add an order to the anchor based on it\'s order with other anchors', () => {
    component.ngAfterViewInit();
    fixture.detectChanges();
    expect(component.order).toBe(0);

    mockPageAnchors = [
      {
        id: 'one'
      },
      {
        id: 'test-content'
      }
    ];

    component.ngAfterViewInit();
    fixture.detectChanges();
    expect(component.order).toBe(1);
  });

  it('should register the page anchor with the page anchor service', () => {
    let expectedAnchor = {
      path: ['/'],
      name: 'Test Content',
      fragment: 'test-content',
      order: 1
    };

    component.ngOnInit();
    component.ngAfterViewInit();
    expect(mockAnchorService.addPageAnchor).toHaveBeenCalledWith(expectedAnchor);
  });

  it('scroll to anchor should call the elements scroll to anchor method', () => {
    component.scrollToAnchor();
    fixture.detectChanges();
    expect(mockWindowService.testElement.scrollIntoView).toHaveBeenCalled();
  });
});
