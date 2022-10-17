import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyAppConfig, SkyAppRuntimeConfigParamsProvider } from '@skyux/config';

import { HrefDirectiveFixtureComponent } from './fixtures/href-fixture.component';
import { HrefResolverFixtureService } from './fixtures/href-resolver-fixture.service';
import { SkyHrefResolverService } from './href-resolver.service';
import { SkyHrefModule } from './href.module';

describe('SkyHref Directive', () => {
  let fixture: ComponentFixture<HrefDirectiveFixtureComponent>;
  let el: HTMLElement;
  let getAllParam: boolean | undefined;

  function setup(
    params: any,
    provideSkyAppConfig = true,
    providesParamsProvider = true
  ): void {
    const providers: any[] = [
      {
        provide: SkyAppRuntimeConfigParamsProvider,
        useValue: providesParamsProvider
          ? {
              params: {
                getAll: () => params,
              },
            }
          : undefined,
      },
      {
        provide: SkyHrefResolverService,
        useClass: HrefResolverFixtureService,
      },
    ];

    if (provideSkyAppConfig) {
      const skyAppConfig = {
        skyux: {
          name: 'test',
        },
        runtime: {
          params: {
            getAll: (p?: boolean) => {
              getAllParam = p;
              return params;
            },
          },
        },
      };

      providers.push({
        provide: SkyAppConfig,
        useValue: skyAppConfig,
      });
    }

    TestBed.configureTestingModule({
      declarations: [HrefDirectiveFixtureComponent],
      imports: [RouterTestingModule, SkyHrefModule, HttpClientTestingModule],
      providers,
    });

    fixture = TestBed.createComponent(HrefDirectiveFixtureComponent);
    el = fixture.nativeElement;
    fixture.detectChanges(); // initial binding
  }

  it('should create links', fakeAsync(() => {
    setup({});

    tick(100);
    const links = Array.from(el.querySelectorAll('a'));
    expect(links.filter((e: HTMLElement) => !!e.offsetParent).length).toEqual(
      6
    );
  }));

  it('should hide links that the user cannot access', fakeAsync(() => {
    setup({});

    tick(100);
    const element: HTMLElement | null = el.querySelector('.noAccessLink a');
    expect(element?.offsetParent).toBeFalsy();
  }));

  it('should check availability when the link changes', fakeAsync(() => {
    setup({});

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
    setup({});

    tick(100);
    const element: HTMLElement | null = el.querySelector('.localLink');
    expect(element?.textContent).toBe('Example');
  }));

  it('should set href without any query parameters', fakeAsync(() => {
    setup({});

    tick(100);
    const element: HTMLElement | null = el.querySelector('.simpleLink a');
    expect(element?.getAttribute('href')).toEqual(
      'https://example.com/example/page?query=param'
    );
  }));

  it('should set href with query parameters', fakeAsync(() => {
    setup({
      asdf: 123,
      jkl: 'mno',
    });

    tick(100);
    const element: HTMLElement | null = el.querySelector('.simpleLink a');
    expect(element?.getAttribute('href')).toEqual(
      'https://example.com/example/page?asdf=123&jkl=mno&query=param'
    );
  }));

  it('should override query parameters', fakeAsync(() => {
    setup({ query: 'param' }, false);
    fixture.componentInstance.dynamicLink =
      '1bb-nav://simple-app/example/page?query=override';
    fixture.detectChanges();

    tick(100);
    const element: HTMLElement | null = el.querySelector('.dynamicLink a');
    expect(element?.getAttribute('href')).toEqual(
      'https://example.com/example/page?query=override'
    );
  }));

  it('should handle an undefined value', fakeAsync(() => {
    setup({}, false);
    fixture.detectChanges();
    tick(100);
    fixture.componentInstance.dynamicLink = undefined;
    fixture.detectChanges();
    const element: HTMLElement | null = el.querySelector('.dynamicLink a');
    expect(element?.getAttribute('href')).toBeNull();
  }));

  it('should set href with merged query parameters supplied by the app config', fakeAsync(() => {
    setup({
      asdf: 123,
      jkl: 'mno',
    });

    tick(100);
    const element: HTMLElement | null = el.querySelector('.simpleLink a');
    expect(element?.getAttribute('href')).toEqual(
      'https://example.com/example/page?asdf=123&jkl=mno&query=param'
    );
  }));

  it('should call getAll with excludeDefaults set to true', fakeAsync(() => {
    setup({});
    expect(getAllParam).toBe(true);
  }));

  it('should get params from SkyAppRuntimeConfigParamsProvider if SkyAppConfig undefined', fakeAsync(() => {
    setup(
      {
        asdf: 123,
        jkl: 'mno',
      },
      false
    );

    tick(100);
    const element = fixture.nativeElement.querySelector('.simpleLink a');
    expect(element.getAttribute('href')).toEqual(
      'https://example.com/example/page?asdf=123&jkl=mno&query=param'
    );
  }));

  it('should handle neither SkyAppRuntimeConfigParamsProvider or SkyAppConfig being provided', fakeAsync(() => {
    setup(
      {
        asdf: 123,
        jkl: 'mno',
      },
      false,
      false
    );

    tick(100);
    const element = fixture.nativeElement.querySelector('.simpleLink a');
    expect(element.getAttribute('href')).toEqual(
      'https://example.com/example/page?query=param'
    );
  }));

  it('should handle an error', fakeAsync(() => {
    setup({});

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
    setup({});

    fixture.componentInstance.dynamicElse = 'unlink';
    fixture.componentInstance.dynamicLink = 'nope://simple-app/example/page';
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('.dynamicLink a');
    expect(element.hidden).toBeFalse();
    expect(element.getAttribute('href')).toBeNull();
  }));

  it('should handle link without protocol', fakeAsync(() => {
    setup({});

    fixture.componentInstance.dynamicLink = '/example/page';
    fixture.detectChanges();
    tick();
    const element = fixture.nativeElement.querySelector('.dynamicLink a');
    expect(element.hidden).toBeFalse();
  }));

  it('should handle link with a fragment', fakeAsync(() => {
    setup({});

    fixture.detectChanges();
    tick(100);

    const element = fixture.nativeElement.querySelector('.fragmentLink a');
    expect(element.getAttribute('href')).toEqual(
      'https://success/example/page#foobar'
    );
  }));

  it('should accept several formats for the link', fakeAsync(() => {
    setup({}, true);

    fixture.componentInstance.dynamicLink = ['1bb-nav://simple-app', 'allowed'];
    fixture.detectChanges();
    tick(100);
    const element = fixture.nativeElement.querySelector('.dynamicLink a');
    expect(element.getAttribute('hidden')).toBeNull();

    fixture.componentInstance.dynamicLink = [
      'test://simple-app',
      'allowed',
      'to',
      'be',
      'complicated',
    ];
    fixture.detectChanges();
    tick(100);
    expect(element.getAttribute('href')).toBe(
      'https://success/allowed/to/be/complicated'
    );
  }));

  it('should handle delayed response', fakeAsync(() => {
    setup({});
    fixture.componentInstance.setSlowLink(true);

    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.slowLink a');
    expect(element.hidden).toBe(true);
    flush();
    expect(element.hidden).toBe(false);
  }));
});
