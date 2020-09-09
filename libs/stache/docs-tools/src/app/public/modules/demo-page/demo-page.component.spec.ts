import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  of
} from 'rxjs';

import {
  SkyDocsSupportalService
} from '../shared/docs-tools-supportal.service';

import {
  DemoPageFixtureComponent
} from './fixtures/demo-page.component.fixture';

import {
  DemoPageFixturesModule
} from './fixtures/demo-page-fixtures.module';

//#region helpers
function getSidebarLinks(fixture: ComponentFixture<any>): NodeListOf<HTMLAnchorElement> {
  return fixture.nativeElement.querySelectorAll('.stache-nav a');
}

describe('Demo page component', () => {

  let fixture: ComponentFixture<DemoPageFixtureComponent>;
  let component: DemoPageFixtureComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DemoPageFixturesModule
      ]
    });

    fixture = TestBed.createComponent(DemoPageFixtureComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should set the page title on init', () => {
    fixture.detectChanges();
    const pageTitle = document.title;

    expect(pageTitle).toEqual(component.pageTitle);
  });

  it('should call the supportal service and update the sidebar routes', () => {
    const supportalService = TestBed.inject(SkyDocsSupportalService);
    const spy = spyOn(supportalService, 'getComponentsInfo').and.returnValue(
      of([
        {
          name: 'foo',
          url: '/foo'
        },
        {
          name: 'bar',
          url: '/bar'
        },
        {
          name: 'baz',
          url: '/baz'
        }
      ])
    );

    fixture.detectChanges();
    const sidebarLinks = getSidebarLinks(fixture);

    expect(spy).toHaveBeenCalled();
    expect(sidebarLinks.length).toEqual(3);
    expect(sidebarLinks[0].textContent).toEqual('foo');
    expect(sidebarLinks[1].textContent).toEqual('bar');
    expect(sidebarLinks[2].textContent).toEqual('baz');
  });

  it('should remove hostname for any links returned from the supportal service that match current site', () => {
    const supportalService = TestBed.inject(SkyDocsSupportalService);
    const spy = spyOn(supportalService, 'getComponentsInfo').and.returnValue(
      of([
        {
          name: 'foo',
          url: 'https://www.example.com/demo-test/foo' // Hostname matches MockSkyAppConfig.skyux.host.url
        },
        {
          name: 'bar',
          url: 'https://www.anothersite.com/bar'
        }
      ])
    );

    fixture.detectChanges();
    const sidebarLinks = getSidebarLinks(fixture);

    expect(spy).toHaveBeenCalled();
    expect(sidebarLinks[0].getAttribute('href')).toEqual('/foo');
    expect(sidebarLinks[1].getAttribute('href')).toEqual('https://www.anothersite.com/bar');
  });

  it('should remove URL parameters from any URLs returned by supportal service', () => {
    const supportalService = TestBed.inject(SkyDocsSupportalService);
    const spy = spyOn(supportalService, 'getComponentsInfo').and.returnValue(
      of([
        {
          name: 'foo',
          url: '/foo?svcid=test-svcid'
        },
        {
          name: 'bar',
          url: '/bar?envid=test-envid&svcid=test-svcid'
        }
      ])
    );

    fixture.detectChanges();
    const sidebarLinks = getSidebarLinks(fixture);

    expect(spy).toHaveBeenCalled();
    expect(sidebarLinks[0].getAttribute('href')).toEqual('/foo');
    expect(sidebarLinks[1].getAttribute('href')).toEqual('/bar');
  });
});
