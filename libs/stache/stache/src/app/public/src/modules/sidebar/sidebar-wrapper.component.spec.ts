import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { expect } from '@blackbaud/skyux-lib-testing';

import { StacheSidebarWrapperComponent } from './sidebar-wrapper.component';
import { StacheSidebarComponent } from './sidebar.component';
import { StacheNavComponent, StacheNavService } from '../nav';

import { Subject } from 'rxjs';

import {
  StacheWindowRef,
  StacheRouteMetadataService,
  StacheRouteService,
  StacheOmnibarAdapterService
} from '../shared';

import { RouterLinkStubDirective } from './fixtures/router-link-stub.directive';
import { StacheLinkModule } from '../link';

describe('StacheSidebarWrapperComponent', () => {
  const CONTAINER_SIDEBAR_CLASSNAME = 'stache-container-sidebar';
  let component: StacheSidebarWrapperComponent;
  let fixture: ComponentFixture<StacheSidebarWrapperComponent>;
  let mockElement: HTMLElement;
  let mockRouteService: any;
  let mockOmnibarService: any;
  let mockWindowRef: any;

  let activeUrl: string = '/';
  let windowWidth = 1000;
  let omnibarHeight = 50;

  class MockRouteService {
    public getActiveUrl() {
      return activeUrl;
    }

    public getActiveRoutes() {
      return [
        {
          name: 'Home',
          path: '',
          children: [
            {
              name: 'Test',
              path: '/test',
              children: [
                {
                  name: 'Test Child',
                  path: '/test/child'
                }
              ]
            }
          ]
        }
      ];
    }
  }

  class MockWindowRef {
    public nativeWindow = {
     innerWidth: windowWidth,
     document: {
        querySelector() {
          return mockElement;
        },
        querySelectorAll() {}
      }
    };

    public onResize$ = new Subject();
}

  class MockOmnibarService {
    public getHeight() {
      return omnibarHeight;
    }
  }

  beforeEach(() => {
    mockRouteService = new MockRouteService();
    mockOmnibarService = new MockOmnibarService();
    mockWindowRef = new MockWindowRef();

    TestBed.configureTestingModule({
      declarations: [
        StacheNavComponent,
        StacheSidebarComponent,
        StacheSidebarWrapperComponent,
        RouterLinkStubDirective
      ],
      imports: [
        RouterTestingModule,
        StacheLinkModule
      ],
      providers: [
        StacheNavService,
        { provide: StacheWindowRef, useValue: mockWindowRef },
        { provide: StacheOmnibarAdapterService, useValue: mockOmnibarService },
        { provide: StacheRouteService, useValue: mockRouteService },
        { provide: StacheRouteMetadataService, useValue: { routes: [] } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheSidebarWrapperComponent);
    component = fixture.componentInstance;
    component.sidebarRoutes = mockRouteService.getActiveRoutes();
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should set the top value for the wrapper based on the omnibar height', () => {
    component.ngOnInit();
    let el = fixture.debugElement.query(By.css('.stache-sidebar-wrapper')).nativeElement;
    expect(el.style.top).toEqual(`${omnibarHeight}px`);

    omnibarHeight = 0;
    component.ngOnInit();
    fixture.detectChanges();
    expect(el.style.top).toEqual(`0px`);
  });

  it('should open and close the sidebar', () => {
    expect(component.sidebarOpen).toEqual(false);
    component.toggleSidebar();
    expect(component.sidebarOpen).toEqual(true);
    component.toggleSidebar();
    expect(component.sidebarOpen).toEqual(false);
  });

  it('should close the sidebar when the window size is below the WINDOW_SIZE_MID', () => {
    component.sidebarOpen = true;
    mockWindowRef.nativeWindow.innerWidth = 10;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.sidebarOpen).toBe(false);
  });

  it('should open the sidebar when the window size is above the WINDOW_SIZE_MID', () => {
    component.sidebarOpen = false;
    mockWindowRef.nativeWindow.innerWidth = 1000;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.sidebarOpen).toBe(true);
  });

  it('should call the check the window width on window resize', () => {
    component.sidebarOpen = false;
    mockWindowRef.nativeWindow.innerWidth = 10;
    mockWindowRef.onResize$.next();
    fixture.detectChanges();
    expect(component.sidebarOpen).toBe(false);
  });

  it('should be accessible', async(() => {
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement).toBeAccessible();
  }));

  it(`should add the class ${ CONTAINER_SIDEBAR_CLASSNAME } to the stache-container if one exists`, () => {
    mockElement = document.createElement('div');
    component.ngAfterViewInit();
    expect(mockElement.className).toContain(CONTAINER_SIDEBAR_CLASSNAME);
    mockElement.remove();
  });

  it(`should remove the class ${ CONTAINER_SIDEBAR_CLASSNAME } from the stache-container on destroy`, () => {
    mockElement = document.createElement('div');
    component.ngAfterViewInit();
    expect(mockElement.className).toContain(CONTAINER_SIDEBAR_CLASSNAME);
    component.ngOnDestroy();
    expect(mockElement.className).not.toContain(CONTAINER_SIDEBAR_CLASSNAME);
    mockElement.remove();
  });
});
