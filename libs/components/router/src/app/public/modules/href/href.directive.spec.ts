import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyAppConfig, SkyAppRuntimeConfigParamsProvider } from '@skyux/config';

import { HrefDirectiveFixtureComponent } from './fixtures/href-fixture.component';
import { HrefResolverFixtureService } from './fixtures/href-resolver-fixture.service';
import { SkyHrefResolverService } from './href-resolver.service';
import { SkyHrefModule } from './href.module';

describe('SkyHref Directive', () => {
  let fixture: ComponentFixture<HrefDirectiveFixtureComponent>;
  let debugElement: DebugElement;
  let getAllParam: boolean;

  function setup(
    params: any,
    useQueryParams: boolean,
    provideSkyAppConfig = true
  ): void {
    const skyAppConfig = {
      skyux: {
        name: 'test'
      },
      runtime: {}
    };
    if (provideSkyAppConfig) {
      skyAppConfig.runtime = {
        params: {
          getAll: (p?: boolean) => {
            getAllParam = p;
            return params;
          }
        }
      };
    }
    const providers = [
      {
        provide: SkyAppConfig,
        useValue: {
          ...skyAppConfig
        }
      },
      {
        provide: SkyAppRuntimeConfigParamsProvider,
        useValue: {
          params: {
            getAll: () => params
          }
        }
      },
      {
        provide: SkyHrefResolverService,
        useClass: HrefResolverFixtureService
      }
    ];

    TestBed.configureTestingModule({
      declarations: [HrefDirectiveFixtureComponent],
      imports: [RouterTestingModule, SkyHrefModule, HttpClientTestingModule],
      providers
    });

    fixture = TestBed.createComponent(HrefDirectiveFixtureComponent);
    fixture.detectChanges(); // initial binding
    debugElement = fixture.debugElement;
  }

  it('should create links', fakeAsync(() => {
    setup({}, false);

    tick(100);
    const links = Array.from(fixture.nativeElement.querySelectorAll('a'));
    expect(links.filter((e: HTMLElement) => !!e.offsetParent).length).toEqual(5);
  }));

  it('should hide links that the user cannot access', fakeAsync(() => {
    setup({}, true);

    tick(100);
    const element = debugElement.nativeElement.querySelector('.noAccessLink a');
    expect(element.offsetParent).toBeFalsy();
  }));

  it('should check availability when the link changes', fakeAsync(() => {
    setup({}, true);

    tick(100);
    const element = fixture.nativeElement.querySelector('.dynamicLink a');
    expect(element.getAttribute('hidden')).toBeNull();

    fixture.componentInstance.dynamicLink = 'nope://simple-app/example/page';
    fixture.detectChanges();
    tick(100);
    expect(element.getAttribute('hidden')).toBe('hidden');

    fixture.componentInstance.dynamicLink = '1bb-nav://simple-app/allowed';
    fixture.detectChanges();
    tick(100);
    expect(element.getAttribute('hidden')).toBeNull();
  }));

  it('should default to local app', fakeAsync(() => {
    setup({}, true);

    tick(100);
    const element = debugElement.nativeElement.querySelector('.localLink');
    expect(element.textContent).toBe('Example');
  }));

  it('should set href without any query parameters', fakeAsync(() => {
    setup({}, false);

    tick(100);
    const element = debugElement.nativeElement.querySelector('.simpleLink a');
    expect(element.getAttribute('href')).toEqual(
      'https://example.com/example/page?query=param'
    );
  }));

  it('should set href with query parameters', fakeAsync(() => {
    setup(
      {
        asdf: 123,
        jkl: 'mno'
      },
      false
    );

    tick(100);
    const element = debugElement.nativeElement.querySelector('.simpleLink a');
    expect(element.getAttribute('href')).toEqual(
      'https://example.com/example/page?asdf=123&jkl=mno&query=param'
    );
  }));

  it('should override query parameters', fakeAsync(() => {
    setup({ query: 'param' }, false);
    fixture.componentInstance.dynamicLink = '1bb-nav://simple-app/example/page?query=override';
    fixture.detectChanges();

    tick(100);
    const element = debugElement.nativeElement.querySelector('.dynamicLink a');
    expect(element.getAttribute('href')).toEqual(
      'https://example.com/example/page?query=override'
    );
  }));

  it('should set href with merged query parameters supplied by the app config', fakeAsync(() => {
    setup(
      {
        asdf: 123,
        jkl: 'mno'
      },
      true
    );

    tick(100);
    const element = debugElement.nativeElement.querySelector('.simpleLink a');
    expect(element.getAttribute('href')).toEqual(
      'https://example.com/example/page?asdf=123&jkl=mno&query=param'
    );
  }));

  it('should call getAll with excludeDefaults set to true', fakeAsync(() => {
    setup({}, true);
    expect(getAllParam).toBe(true);
  }));

  it('should get params from SkyAppRuntimeConfigParamsProvider if SkyAppConfig undefined', fakeAsync(() => {
    setup(
      {
        asdf: 123,
        jkl: 'mno'
      },
      true,
      false
    );

    tick(100);
    const element = fixture.nativeElement.querySelector('.simpleLink a');
    expect(element.getAttribute('href')).toEqual(
      'https://example.com/example/page?asdf=123&jkl=mno&query=param'
    );
  }));

  it('should handle an error', fakeAsync(() => {
    setup({}, true);

    tick(100);
    const element = fixture.nativeElement.querySelector('.dynamicLink a');
    expect(element.getAttribute('hidden')).toBeNull();

    fixture.componentInstance.dynamicLink = 'error://simple-app/example/page';
    fixture.detectChanges();
    tick(100);
    expect(element.getAttribute('hidden')).toBe('hidden');

    fixture.componentInstance.dynamicLink = '1bb-nav://simple-app/fixed';
    fixture.detectChanges();
    tick(100);
    expect(element.getAttribute('hidden')).toBeNull();
  }));

  it('should handle the else parameter', fakeAsync(() => {
    setup({}, true);

    fixture.componentInstance.dynamicElse = 'unlink';
    fixture.componentInstance.dynamicLink = 'nope://simple-app/example/page';
    fixture.detectChanges();
    flush();

    const element = fixture.nativeElement.querySelector('.dynamicLink a');
    expect(element.style.display).not.toBe('none');
    expect(element.getAttribute('href')).toBeNull();
  }));

  it('should handle link without protocol', fakeAsync(() => {
    setup({}, true);

    fixture.componentInstance.dynamicLink = '/example/page';
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const element = fixture.nativeElement.querySelector('.dynamicLink a');
      expect(element.style.display).not.toBe('none');
    });
  }));
});
