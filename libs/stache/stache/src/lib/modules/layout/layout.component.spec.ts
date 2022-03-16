import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  NO_ERRORS_SCHEMA
} from '@angular/core';

import {
  By
} from '@angular/platform-browser';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  StacheLayoutComponent
} from './layout.component';

import {
  StacheLayoutModule
} from './layout.module';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  StacheRouteService
} from '../router/route.service';

import {
  StacheRouteMetadataService
} from '../router/route-metadata.service';

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

class MockSkyAppConfig {
  public runtime: any = {
    routes: mockRoutes
  };
}

class MockRouteService {
  public getActiveRoutes() {
    return mockRoutes;
  }
  public getActiveUrl() {
    return '';
  }
}

describe('StacheLayoutComponent', () => {
  let component: StacheLayoutComponent;
  let fixture: ComponentFixture<StacheLayoutComponent>;
  let sampleRoutes = [{ name: 'test', path: '/test' }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StacheLayoutModule,
        RouterTestingModule
      ],
      providers: [
        { provide: StacheRouteService, useClass: MockRouteService },
        { provide: SkyAppConfig, useClass: MockSkyAppConfig },
        { provide: StacheRouteMetadataService, useValue: { routes: [] } }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheLayoutComponent);
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

  it('should have a layoutType input', () => {
    component.layoutType = 'sidebar';
    fixture.detectChanges();
    expect(component.layoutType).toBe('sidebar');
  });

  it('should have an inPageRoutes input', () => {
    component.inPageRoutes = sampleRoutes;
    fixture.detectChanges();
    expect(component.inPageRoutes.length).toBe(1);
  });

  it('should have a showTableOfContents input', () => {
    component.showTableOfContents = true;
    fixture.detectChanges();
    expect(component.showTableOfContents).toBe(true);
  });

  it('should have a sidebarRoutes input', () => {
    component.sidebarRoutes = sampleRoutes;
    fixture.detectChanges();
    expect(component.sidebarRoutes.length).toBe(1);
  });

  it('should have a breadcrumbsRoutes input', () => {
    component.breadcrumbsRoutes = sampleRoutes;
    fixture.detectChanges();
    expect(component.breadcrumbsRoutes.length).toBe(1);
  });

  it('should have a showBreadcrumbs input', () => {
    component.showBreadcrumbs = false;
    fixture.detectChanges();
    expect(component.showBreadcrumbs).toBe(false);
  });

  it('should have a showEditButton input', () => {
    component.showBreadcrumbs = true;
    fixture.detectChanges();
    expect(component.showBreadcrumbs).toBe(true);
  });

  it('should have a showBackToTop input', () => {
    component.showBackToTop = true;
    fixture.detectChanges();
    expect(component.showBackToTop).toBe(true);
  });

  it('should set the input, layoutType, to sidebar by default', () => {
    fixture.detectChanges();
    expect(component.layoutType).toBe('sidebar');
  });

  it('should set the template ref to blank given the layoutType', () => {
    component.layoutType = 'blank';
    fixture.detectChanges();
    let layout = component['blankTemplateRef'];
    expect(component.templateRef).toBe(layout);
  });

  it('should set the template ref to container given the layoutType', () => {
    component.layoutType = 'container';
    fixture.detectChanges();
    let layout = component['containerTemplateRef'];
    expect(component.templateRef).toBe(layout);
  });

  it('should set the template ref to sidebar given the layoutType', () => {
    component.layoutType = 'sidebar';
    fixture.detectChanges();
    let layout = component['sidebarTemplateRef'];
    expect(component.templateRef).toBe(layout);
  });

  it('should set the min-height of the wrapper', fakeAsync(() => {
    const spy = spyOn(component['renderer'], 'setStyle').and.callThrough();
    component.layoutType = 'sidebar';
    component.ngOnChanges();
    fixture.detectChanges();
    tick();
    const wrapper = fixture.debugElement.query(By.css('.stache-layout-wrapper')).nativeElement;
    expect(spy.calls.argsFor(0)[0]).toEqual(wrapper);
    expect(spy.calls.argsFor(0)[1]).toEqual('min-height');
  }));

});
