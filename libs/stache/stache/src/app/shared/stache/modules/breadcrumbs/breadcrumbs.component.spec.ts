import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router, NavigationStart } from '@angular/router';

import { Observable } from 'rxjs';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';
import { StacheConfigService } from '../shared';

import { StacheBreadcrumbsComponent } from './breadcrumbs.component';
import { StacheNavComponent } from '../nav/nav.component';
import { StacheNavService } from '../nav/nav.service';
import { StacheWindowRef } from '../shared';

describe('StacheBreadcrumbsComponent', () => {
  let component: StacheBreadcrumbsComponent;
  let fixture: ComponentFixture<StacheBreadcrumbsComponent>;
  let router: Router;

  class MockStacheConfigService {
    public runtime: any = {
      routes: [
        {
          routePath: ''
        },
        {
          routePath: 'parent'
        },
        {
          routePath: 'parent/child'
        },
        {
          routePath: 'parent/child/grandchild'
        },
        {
          routePath: 'other-route'
        },
        {
          routePath: 'other-parent'
        },
        {
          routePath: 'other-parent/other-child'
        },
        {
          routePath: 'other-parent/other-child/other-grandchild'
        }
      ]
    };
  }

  class MockRouter {
    public url = '/parent/child/grandchild';
    public events = Observable.of(new NavigationStart(0, ''));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheNavComponent,
        StacheBreadcrumbsComponent
      ],
      providers: [
        StacheNavService,
        StacheWindowRef,
        { provide: StacheConfigService, useClass: MockStacheConfigService },
        { provide: Router, useClass: MockRouter }
      ]
    })
    .compileComponents();

    router = TestBed.get(Router);
    fixture = TestBed.createComponent(StacheBreadcrumbsComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should display navigation links', () => {
    component.routes = [
      { name: 'Test 1', path: [] },
      { name: 'Test 2', path: [] }
    ];

    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.css('.stache-nav-anchor'));

    expect(links.length).toBe(2);
  });

  it('should generate grandchild routes from SkyAppConfig', () => {
    fixture.detectChanges();
    expect(component.routes.length).toBe(4);
  });

  it('should generate child routes from SkyAppConfig', () => {
    router.url = '/parent/child';
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.routes.length).toBe(3);
  });

  it('should add a link to the home page', () => {
    router.url = '/';
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.routes[0].name).toBe('Home');
  });
});
