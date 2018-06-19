import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs/Observable';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheWrapperTestComponent } from './fixtures/wrapper.component.fixture';
import { StacheWrapperComponent } from './wrapper.component';
import { StacheTitleService } from './title.service';

import { StacheNavService, StacheNavLink } from '../nav';

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
import { StachePageAnchorService } from '../page-anchor/page-anchor.service';

describe('StacheWrapperComponent', () => {
  let component: StacheWrapperComponent;
  let fixture: ComponentFixture<StacheWrapperComponent>;
  let mockActivatedRoute: any;
  let mockConfigService: any;
  let mockNavService: any;
  let mockJsonDataService: any;
  let mockTitleService: any;
  let mockWindowService: any;
  let mockAnchorService: any;
  let mockOmnibarService: any;
  let mockTextContent: string = '';

  class MockActivatedRoute {
    public fragment: Observable<string> = Observable.of('test-route');
    public url: Observable<string[]> = Observable.of(['test', 'routes']);
    // snapshot is a required prop on activatedRoute to avoid an error with `'_lastPathIndex' of undefined`
    // https://stackoverflow.com/questions/41245783/angular-testing-router-params-breaks-test-bed
    public snapshot = {};
    public setFragment(fragString: any) {
      this.fragment = Observable.of(fragString);
    }
  }

  class MockNavService {
    public navigate(route: any) { }
  }

  class MockOmbibarService {
    public checkForOmnibar() {}
    public getHeight() {}
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

  class MockAnchorService {
    public anchorStream = Observable.of(
      {
        path: 'Second Path',
        name: 'Second Heading',
        fragment: 'Second Fragment'
      } as StacheNavLink,
      {
        path: 'First Path',
        name: 'First Heading',
        fragment: 'First Fragment',
        order: 0
      } as StacheNavLink
    );
    public addPageAnchor = function() {};
  }

  class MockWindowService {
    public nativeWindow = {
      document: {
        getElementById: jasmine.createSpy('getElementById').and.callFake(function(id: any) {
          if (id !== undefined) {
            return {
              scrollIntoView() { }
            };
          }
          return id;
        }),
        querySelector: jasmine.createSpy('querySelector').and.callFake(function(selector: string) {
          return {
            textContent: mockTextContent,
            classList: {
              add(cssClass: string) { }
            },
            scrollIntoView() { },
            offsetHeight: 50
          };
        }),
        querySelectorAll: jasmine.createSpy('querySelectorAll').and.callFake((selector: string): any[] => {
            return [];
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
    mockNavService = new MockNavService();
    mockConfigService = new MockConfigService();
    mockJsonDataService = new MockJsonDataService();
    mockTitleService = new MockTitleService();
    mockWindowService = new MockWindowService({});
    mockAnchorService = new MockAnchorService();
    mockOmnibarService = new MockOmbibarService();

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
        StacheRouteService,
        { provide: StacheNavService, useValue: mockNavService },
        { provide: StacheOmnibarAdapterService, useValue: mockOmnibarService },
        { provide: StacheJsonDataService, useValue: mockJsonDataService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: StacheTitleService, useValue: mockTitleService },
        { provide: StacheWindowRef, useValue: mockWindowService },
        { provide: StacheConfigService, useValue: mockConfigService },
        { provide: StachePageAnchorService, useValue: mockAnchorService },
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
    const title = 'Test Title';
    component.windowTitle = title;
    fixture.detectChanges();
    expect(mockTitleService.setTitle).toHaveBeenCalledWith(title);
  });

  it('should set the window title based on stache pageTitle', () => {
    const title = 'Page Title';
    component.pageTitle = title;
    fixture.detectChanges();
    expect(mockTitleService.setTitle).toHaveBeenCalledWith(title);
  });

  it('should set the window title based on stache navTitle', () => {
    const title = 'Nav Title';
    component.navTitle = title;
    fixture.detectChanges();
    expect(mockTitleService.setTitle).toHaveBeenCalledWith(title);
  });

  it('should set the window title based on the Tutorial Header title', () => {
    const title = 'Tutorial Header Title';
    mockTextContent = title;
    component.ngOnInit();
    fixture.detectChanges();
    expect(mockTitleService.setTitle).toHaveBeenCalledWith(title);
    mockTextContent = '';
  });

  it('should not set the window title when the Tutorial Header title is absent', () => {
    fixture.detectChanges();
    expect(mockTitleService.setTitle).toHaveBeenCalledWith(undefined);
  });

  it('should set the window title based on pageTitle with existing navTitle and Tutorial Header', () => {
    const pageTitle = 'PageTitle';
    component.pageTitle = pageTitle;
    component.navTitle = 'Nav Title';
    mockTextContent = 'Tutorial Header Title';
    component.ngOnInit();
    fixture.detectChanges();
    expect(mockTitleService.setTitle).toHaveBeenCalledWith(pageTitle);
    mockTextContent = '';
  });

  it('should set the window title based on navTitle with existing Tutorial Header', () => {
    const navTitle = 'Nav Title';
    component.navTitle = navTitle;
    mockTextContent = 'Tutorial Header Title';
    component.ngOnInit();
    fixture.detectChanges();
    expect(mockTitleService.setTitle).toHaveBeenCalledWith(navTitle);
    mockTextContent = '';
  });

  it('should set the jsonData property on init', () => {
    fixture.detectChanges();
    expect(component.jsonData).toEqual(jasmine.any(Object));
  });

  it('should detect the omnibar if it exists on init', () => {
    spyOn(mockOmnibarService, 'checkForOmnibar').and.callThrough();
    component.ngOnInit();
    expect(mockOmnibarService.checkForOmnibar).toHaveBeenCalled();
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
    expect(testComponent.testWrapper.pageAnchorSubscription).not.toBe(undefined);

    testComponent.testWrapper.ngOnInit();
    expect(testComponent.testWrapper.pageAnchorSubscription).not.toBe(undefined);

    testComponent.testWrapper.ngOnDestroy();
    expect(testComponent.testWrapper.pageAnchorSubscription).toBe(undefined);
  });

  it('should not navigate to a fragment if none exist', () => {
    mockActivatedRoute.setFragment(undefined);
    let subscribeSpy = spyOn(mockActivatedRoute.fragment, 'subscribe').and.callThrough();
    let navSpy = spyOn(mockNavService, 'navigate').and.callThrough();
    const testFixture = TestBed.createComponent(StacheWrapperTestComponent);

    testFixture.detectChanges();
    expect(subscribeSpy).toHaveBeenCalled();
    expect(navSpy).not.toHaveBeenCalled();
  });
});
