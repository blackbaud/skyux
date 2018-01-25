import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs/Observable';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheWrapperTestComponent } from './fixtures/wrapper.component.fixture';
import { StacheWrapperComponent } from './wrapper.component';
import { StacheTitleService } from './title.service';

import { StacheNavService } from '../nav';

import {
  StacheWindowRef,
  StacheRouteService,
  StacheConfigService,
  StacheOmnibarAdapterService,
  StacheJsonDataService,
  STACHE_ROUTE_METADATA_PROVIDERS
} from '../shared';

import { StacheLayoutModule } from '../layout';
import { StachePageAnchorModule } from '../page-anchor';

describe('StacheWrapperComponent', () => {
  let component: StacheWrapperComponent;
  let fixture: ComponentFixture<StacheWrapperComponent>;
  let mockActivatedRoute: any;
  let mockConfigService: any;
  let mockJsonDataService: any;
  let mockTitleService: any;
  let mockWindowService: any;

  class MockActivatedRoute {
    public fragment: Observable<string> = Observable.of('test-route');
    public url: Observable<string[]> = Observable.of(['test', 'routes']);
    public setFragment(fragString: any) {
      this.fragment = Observable.of(fragString);
    }
  }

  class MockConfigService {
    public skyux: any = {
      appSettings: {
        stache: {
          editButton: {
            url: 'https://google.com'
          }
        }
      }
    };
    public runtime: any = {
      routes: []
    };
  }

  class MockJsonDataService {
    public getAll = jasmine.createSpy('getAll').and.callFake(() => {
      return {};
    });
  }

  class MockTitleService {
    public setTitle = jasmine.createSpy('setTitle');
  }

  class MockWindowService {
    public nativeWindow = {
      document: {
        getElementById: jasmine.createSpy('getElementById').and.callFake(function(id: any) {
          if (id !== undefined) {
            return {
              getBoundingClientRect() {
                return {
                  y: 0
                };
              }
            };
          }
          return id;
        }),
        querySelector: jasmine.createSpy('querySelector').and.callFake(function(selector: string) {
          return {
            classList: {
              add(cssClass: string) { }
            },
            offsetHeight: 50
          };
        })
      },
      setTimeout: jasmine.createSpy('setTimeout').and.callFake(function(callback: any) {
        return callback();
      }),
      scroll: jasmine.createSpy('scroll').and.callFake(function (x: number, y: number) {
        return true;
      }),
      location: {
        href: ''
      }
    };

    get onResize$() {
      return Observable.of({});
    }

    constructor(private eventManager: any) {
      this.eventManager = {
        addGlobalEventListener: () => {}
      };
    }
  }

  beforeEach(() => {
    mockActivatedRoute = new MockActivatedRoute();
    mockConfigService = new MockConfigService();
    mockJsonDataService = new MockJsonDataService();
    mockTitleService = new MockTitleService();
    mockWindowService = new MockWindowService({});

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StachePageAnchorModule,
        StacheLayoutModule
      ],
      declarations: [
        StacheWrapperComponent,
        StacheWrapperTestComponent
      ],
      providers: [
        StacheNavService,
        StacheRouteService,
        StacheOmnibarAdapterService,
        { provide: StacheJsonDataService, useValue: mockJsonDataService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: StacheTitleService, useValue: mockTitleService },
        { provide: StacheWindowRef, useValue: mockWindowService },
        { provide: StacheConfigService, useValue: mockConfigService },
        STACHE_ROUTE_METADATA_PROVIDERS
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
    component.showBreadcrumbs = false;
    fixture.detectChanges();
    expect(component.showBreadcrumbs).toBe(false);
  });

  it('should have a showEditButton input', () => {
    component.showEditButton = true;
    fixture.detectChanges();
    expect(component.showEditButton).toBe(true);
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

  it('should set the showEditButton based on the config option if set', () => {
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        expect(component.showEditButton).toBe(true);
      });
  });

  it('should set the showEditButton to false by default', async(() => {
    mockConfigService.skyux.appSettings.stache.editButton = undefined;
    fixture = TestBed.createComponent(StacheWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        expect(component.showEditButton).toBe(false);
      });
  }));

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
    fixture.whenStable()
      .then(() => {
        expect(mockWindowService.nativeWindow.document.getElementById)
          .toHaveBeenCalledWith('test-route');
      });
  }));

  it('should scroll the element into view if a fragment exists', async(() => {
    mockActivatedRoute.setFragment(undefined);
    fixture.detectChanges();
    fixture.whenStable()
      .then(() => {
        expect(mockWindowService.nativeWindow.document.getElementById).not.toHaveBeenCalled();
      });
  }));

  it('should set the jsonData property on init', () => {
    fixture.detectChanges();
    expect(component.jsonData).toEqual(jasmine.any(Object));
  });

  it('should update inPageRoutes after content is rendered', () => {
    const testFixture = TestBed.createComponent(StacheWrapperTestComponent);
    const testComponent = testFixture.componentInstance;

    testFixture.detectChanges();

    const inPageRoutes = testComponent.testWrapper.inPageRoutes;
    expect(inPageRoutes[0].name).toEqual('First Heading');
    expect(inPageRoutes[1].name).toEqual('Second Heading');
  });

  it('should unsubscribe page anchor subscriptions after component is destroyed', () => {
    const testFixture = TestBed.createComponent(StacheWrapperTestComponent);
    const testComponent = testFixture.componentInstance;

    testFixture.detectChanges();
    expect(testComponent.testWrapper.pageAnchorSubscriptions.length).toEqual(2);

    testComponent.testWrapper.ngOnDestroy();
    expect(testComponent.testWrapper.pageAnchorSubscriptions.length).toEqual(0);
  });
});
