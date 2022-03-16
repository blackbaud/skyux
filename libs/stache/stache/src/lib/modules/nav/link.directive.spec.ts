import {
  APP_BASE_HREF,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect } from '@skyux-sdk/testing';

import { StacheRouteService } from '../router/route.service';

import { StacheRouterLinkTestComponent } from './fixtures/link.component.fixture';
import { StacheRouterLinkTestLocalRouteComponent } from './fixtures/link.component_localroute.fixture';
import { StacheRouterLinkDirective } from './link.directive';
import { StacheNavModule } from './nav.module';
import { StacheNavService } from './nav.service';

describe('StacheLinkDirective', () => {
  let debugElement: DebugElement;
  let directiveElement: any;
  let fixture: ComponentFixture<StacheRouterLinkTestComponent>;
  let mockNavService: any;
  let mockRouteService: any;

  class MockNavService {
    public navigate = jasmine
      .createSpy('navigate')
      .and.callFake((routeObj: any) => {});

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
                  path: 'parent/child/grandchild',
                },
              ],
            },
          ],
        },
      ],
    },
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
      imports: [StacheNavModule],
      declarations: [
        StacheRouterLinkTestComponent,
        StacheRouterLinkTestLocalRouteComponent,
      ],
      providers: [
        LocationStrategy,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: StacheNavService, useValue: mockNavService },
        { provide: StacheRouteService, useValue: mockRouteService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StacheRouterLinkTestComponent);
    directiveElement = fixture.debugElement.query(
      By.directive(StacheRouterLinkDirective)
    );
    debugElement = fixture.debugElement;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should have a route input', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheRouterLinkDirective
    );
    fixture.detectChanges();
    expect(directiveInstance.stacheRouterLink).toBe('test-route');
  });

  it('should have a fragment input', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheRouterLinkDirective
    );
    fixture.detectChanges();
    expect(directiveInstance.fragment).toBe('test');
  });

  it('should call the navigate method when clicked', async(() => {
    const directiveInstance = directiveElement.injector.get(
      StacheRouterLinkDirective
    );
    spyOn(directiveInstance, 'navigate');
    const link = debugElement.nativeElement.querySelector('a');
    link.click();
    fixture.whenStable().then(() => {
      expect(directiveInstance.navigate).toHaveBeenCalled();
    });
  }));

  it('should set stacheRouterLink input to internal urls', async(() => {
    fixture = TestBed.createComponent(StacheRouterLinkTestLocalRouteComponent);
    directiveElement = fixture.debugElement.query(
      By.directive(StacheRouterLinkDirective)
    );

    const directiveInstance = directiveElement.injector.get(
      StacheRouterLinkDirective
    );
    directiveInstance.stacheRouterLink = '/demos';
    directiveInstance.ngAfterViewInit();
    expect(directiveInstance._stacheRouterLink).toBe('/demos');
  }));

  it('should set stacheRouterLink input to same page urls', async(() => {
    mockActiveUrl = '/test-page';
    fixture = TestBed.createComponent(StacheRouterLinkTestLocalRouteComponent);
    directiveElement = fixture.debugElement.query(
      By.directive(StacheRouterLinkDirective)
    );

    const directiveInstance = directiveElement.injector.get(
      StacheRouterLinkDirective
    );
    directiveInstance.stacheRouterLink = '.';
    expect(directiveInstance._stacheRouterLink).toBe('/test-page');
    mockActiveUrl = '';
  }));

  it('should set stacheRouterLink input to external urls', async(() => {
    fixture = TestBed.createComponent(StacheRouterLinkTestLocalRouteComponent);
    directiveElement = fixture.debugElement.query(
      By.directive(StacheRouterLinkDirective)
    );

    const directiveInstance = directiveElement.injector.get(
      StacheRouterLinkDirective
    );
    directiveInstance.stacheRouterLink = 'https://www.google.com';
    directiveInstance.ngAfterViewInit();
    expect(directiveInstance._stacheRouterLink).toBe('https://www.google.com');
  }));

  it('should open in new window when shift clicked', async(() => {
    const link = debugElement.nativeElement.querySelector('a');
    SkyAppTestUtility.fireDomEvent(link, 'click', {
      keyboardEventInit: {
        shiftKey: true,
      },
    });

    expect(mockNavService.navigate).not.toHaveBeenCalled();
  }));

  it('should open in new window when meta (command) clicked', async(() => {
    const link = debugElement.nativeElement.querySelector('a');
    SkyAppTestUtility.fireDomEvent(link, 'click', {
      keyboardEventInit: {
        metaKey: true,
      },
    });

    expect(mockNavService.navigate).not.toHaveBeenCalled();
  }));

  it('should pass the fragment to the navigate method if it exists', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheRouterLinkDirective
    );
    directiveInstance.stacheRouterLink = 'test-route';
    directiveInstance.fragment = 'test';
    SkyAppTestUtility.fireDomEvent(
      directiveInstance['el'].nativeElement,
      'click'
    );
    fixture.detectChanges();

    expect(mockNavService.navigate).toHaveBeenCalledWith({
      path: 'test-route',
      fragment: 'test',
    });
  });

  it('should not pass a fragment if it does not exist', () => {
    const directiveInstance = directiveElement.injector.get(
      StacheRouterLinkDirective
    );
    directiveInstance.stacheRouterLink = 'test-route';
    directiveInstance.fragment = undefined;

    SkyAppTestUtility.fireDomEvent(
      directiveInstance['el'].nativeElement,
      'click'
    );
    fixture.detectChanges();

    expect(mockNavService.navigate).toHaveBeenCalledWith({
      path: 'test-route',
      fragment: undefined,
    });
  });
});
