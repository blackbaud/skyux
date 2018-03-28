import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, ChangeDetectorRef, ElementRef } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StachePageAnchorTestComponent } from './fixtures/page-anchor.component.fixture';
import { StachePageAnchorComponent } from './page-anchor.component';
import { StacheWindowRef, StacheRouteService } from '../shared';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

let activeUrl: string = '/';

class MockRouteService {
  public getActiveUrl() {
    return activeUrl;
  }
}

class MockElementRef {
  public nativeElement = {
    textContent: {
      trim(): string {
        return 'test-content';
      }
    }
  };
}

class MockChangeDetectorRef {
  public detectChanges() { }
}
class MockWindowService {
  public nativeWindow = {
    document: {
      querySelector: jasmine.createSpy('querySelector').and.callFake((fragment: any) => {
          if (fragment === '#test-content') {
            return this.testElement;
          }
          return undefined;
        })
    },
    location: {
      href: ''
    }
  };

  public testElement = {
    scrollIntoView() { }
  };
}

describe('StachePageAnchorComponent', () => {
  let component: StachePageAnchorComponent;
  let fixture: ComponentFixture<StachePageAnchorComponent>;
  let mockRouteService: any;
  let mockWindowService: any;
  let mockCDRef: any;
  let elementRef: any;
  let debugElement: DebugElement;

  let testDebugElement: DebugElement;
  let testFixture: ComponentFixture<StachePageAnchorTestComponent>;

  beforeEach(() => {
    mockRouteService = new MockRouteService();
    mockWindowService = new MockWindowService();
    mockCDRef = new MockChangeDetectorRef();
    elementRef = new MockElementRef();

    TestBed.configureTestingModule({
      declarations: [
        StachePageAnchorComponent,
        StachePageAnchorTestComponent
      ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        { provide: ElementRef, useValue: elementRef },
        { provide: StacheWindowRef, useValue: mockWindowService },
        { provide: StacheRouteService, useValue: mockRouteService },
        { provide: ChangeDetectorRef, useValue: mockCDRef }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StachePageAnchorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    testFixture = TestBed.createComponent(StachePageAnchorTestComponent);
    testDebugElement = testFixture.debugElement;
  });

  it('should display transcluded content', () => {
    testFixture.detectChanges();
    const heading = testDebugElement.nativeElement.querySelector('.stache-page-anchor-heading');
    expect(heading).toHaveText('Test Content');
  });

  it('should add the fragment as an id to the element', () => {
    testFixture.detectChanges();
    const id = testDebugElement.nativeElement
      .querySelector('.stache-page-anchor')
      .getAttribute('id');
    expect(id).toBe('test-content');
  });

  it('should call the scrollToAnchor and element ScrollIntoView on click', (() => {
    spyOn(mockWindowService.testElement, 'scrollIntoView');
    testDebugElement.componentInstance.fragment = 'test-content';
    testFixture.detectChanges();
    const icon = testDebugElement.nativeElement.querySelector('.stache-page-anchor-icon');
    icon.click();
    expect(mockWindowService.nativeWindow.document.querySelector).toHaveBeenCalledWith('#test-content');
    expect(mockWindowService.testElement.scrollIntoView).toHaveBeenCalled();
  }));

  it('should create a behavior subject and a navlink stream', () => {
    expect(component['_subject'] instanceof BehaviorSubject).toEqual(true);
    expect(component.navLinkStream instanceof Observable).toEqual(true);
  });

  it('should broadcast changes', () => {
    spyOn(component['_subject'], 'next').and.callThrough();
    component.ngAfterViewInit();
    expect(component['_subject'].next).toHaveBeenCalled();
  });
});
