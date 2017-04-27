import { Observable } from 'rxjs/Observable';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';
import { SkyAppWindowRef } from '@blackbaud/skyux-builder/runtime';

import { StacheWrapperComponent } from './wrapper.component';
import { StacheTitleService } from './title.service';

describe('StacheWrapperComponent', () => {
  let component: StacheWrapperComponent;
  let fixture: ComponentFixture<StacheWrapperComponent>;
  let mockActivatedRoute: any;
  let mockTitleService: any;
  let mockWindowService: any;

  class MockActivatedRoute {
    public fragment: Observable<string> = Observable.of('test-route');
    public setFragment(fragString: any) {
      this.fragment = Observable.of(fragString);
    }
  }

  class MockTitleService {
    public setTitle = jasmine.createSpy('setTitle');
  }

  class MockWindowService {
    public nativeWindow = {
      document: {
        getElementById: jasmine.createSpy('getElementById').and.callFake(function(id: any) {
            if (id !== undefined) {
              return { scrollIntoView: jasmine.createSpy('scrollIntoView')};
            }
            return id;
          })
      },
      setTimeout: jasmine.createSpy('setTimeout').and.callFake(function(callback: any) {
        return callback();
      })
    };
  }

  beforeEach(() => {
    mockActivatedRoute = new MockActivatedRoute();
    mockTitleService = new MockTitleService();
    mockWindowService = new MockWindowService();

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        StacheWrapperComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: StacheTitleService, useValue: mockTitleService },
        { provide: SkyAppWindowRef, useValue: mockWindowService }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheWrapperComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should have a pageTitle input', () => {
    component.pageTitle = 'Test Title';
    fixture.detectChanges();
    expect(component.pageTitle).toBe('Test Title');
  });

  it('should have a windowTitle input', () => {
    component.windowTitle = 'Test Title';
    fixture.detectChanges();
    expect(component.windowTitle).toBe('Test Title');
  });

  it('should have a layout input', () => {
    component.layout = 'sidebar';
    fixture.detectChanges();
    expect(component.layout).toBe('sidebar');
  });

   it('should have a sidebarRoutes input', () => {
    component.sidebarRoutes = [{ name: 'test', path: '/test' }];
    fixture.detectChanges();
    expect(component.sidebarRoutes.length).toBe(1);
  });

  it('should have a breadcrumbsRoutes input', () => {
    component.breadcrumbsRoutes = [{ name: 'test', path: '/test' }];
    fixture.detectChanges();
    expect(component.breadcrumbsRoutes.length).toBe(1);
  });

  it('should have a showBreadcrumbs input', () => {
    component.showBreadcrumbs = true;
    fixture.detectChanges();
    expect(component.showBreadcrumbs).toBe(true);
  });

  it('should have a showTableOfContents input', () => {
    component.showTableOfContents = true;
    fixture.detectChanges();
    expect(component.showTableOfContents).toBe(true);
  });

  it('should have a showBackToTop input', () => {
    component.showBackToTop = false;
    fixture.detectChanges();
    expect(component.showBackToTop).toBe(false);
  });

  it('should set the input, showBreadcrumbs, to true by default', () => {
    fixture.detectChanges();
    expect(component.showBreadcrumbs).toBe(true);
  });

  it('should set the input, layout, to "sidebar" by default', () => {
    fixture.detectChanges();
    expect(component.layout).toBe('sidebar');
  });

  it('should set the input, showTableOfContents, to false by default', () => {
    fixture.detectChanges();
    expect(component.showTableOfContents).toBe(false);
  });

  it('should set the input, showBackToTop, to true by default', () => {
    fixture.detectChanges();
    expect(component.showBackToTop).toBe(true);
  });

  it('should set the window title', () => {
    component.windowTitle = 'Test Title';
    fixture.detectChanges();
    expect(mockTitleService.setTitle).toHaveBeenCalledWith('Test Title');
  });

  it('should set the page title', () => {
    component.pageTitle = 'Page Title';
    fixture.detectChanges();
    expect(mockTitleService.setTitle).toHaveBeenCalledWith('Page Title');
  });

  it('should grab the element from the fragment', async(() => {
    component.ngOnInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(mockWindowService.nativeWindow.document.getElementById)
        .toHaveBeenCalledWith('test-route');
    });
  }));

  it('should scroll the element into view if a fragment exists', async(() => {
    mockActivatedRoute.setFragment(undefined);

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(mockWindowService.nativeWindow.document.getElementById)
        .toHaveBeenCalledWith(undefined);
    });
  }));

  it('should update inPageRoutes after content is rendered', async(() => {
    component['pageAnchors'] = [{ name: 'test', path: '/test' }];
    component.ngAfterContentInit();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.inPageRoutes.length).toBe(1);
    });
  }));
});
