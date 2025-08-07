import { Component, Provider } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush,
  tick,
} from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyAppTestUtility } from '@skyux-sdk/testing';
import {
  SkyAppConfig,
  SkyAppConfigParams,
  SkyAppRuntimeConfigParams,
  SkyAppRuntimeConfigParamsProvider,
  SkyuxConfigParams,
} from '@skyux/config';

import { HrefDirectiveFixtureComponent } from './fixtures/href-fixture.component';
import { HrefResolverFixtureService } from './fixtures/href-resolver-fixture.service';
import { SkyHrefResolverService } from './href-resolver.service';

@Component({
  template: '',
  standalone: false,
})
export class BlankComponent {}

function setupTest(options?: {
  params?: SkyuxConfigParams;
  provideParamsProvider?: boolean;
  provideSkyAppConfig?: boolean;
}): {
  el: HTMLElement;
  fixture: ComponentFixture<HrefDirectiveFixtureComponent>;
} {
  options = {
    ...{
      provideParamsProvider: true,
      provideSkyAppConfig: true,
    },
    ...options,
  };

  const providers: Provider[] = [
    {
      provide: SkyHrefResolverService,
      useClass: HrefResolverFixtureService,
    },
  ];

  const skyAppConfig = {
    skyux: { host: { url: 'https://example.com/' } },
    runtime: {
      app: {
        base: 'example/',
      },
      params: {},
    },
  };

  if (options?.params) {
    // Provide `SkyAppRuntimeConfigParamsProvider`.
    if (options.provideParamsProvider) {
      const confParams = new SkyAppConfigParams();
      confParams.init(options.params);

      providers.push({
        provide: SkyAppRuntimeConfigParamsProvider,
        useValue: new SkyAppRuntimeConfigParamsProvider(confParams),
      });
    }

    // Provide `SkyAppConfig`.
    if (options.provideSkyAppConfig) {
      skyAppConfig.runtime.params = new SkyAppRuntimeConfigParams(
        window.location.href,
        options.params,
      );

      providers.push({
        provide: SkyAppConfig,
        useValue: skyAppConfig,
      });
    }
  }

  TestBed.configureTestingModule({
    imports: [
      HrefDirectiveFixtureComponent,
      RouterTestingModule.withRoutes([
        { path: 'page', component: BlankComponent },
      ]),
    ],
    providers,
  });

  const fixture = TestBed.createComponent(HrefDirectiveFixtureComponent);
  const el: HTMLElement = fixture.nativeElement;

  return { el, fixture };
}

describe('SkyHref Directive', () => {
  it('should create links', fakeAsync(() => {
    const { el, fixture } = setupTest();

    fixture.detectChanges();
    tick();

    const links = Array.from(el.querySelectorAll('a'));
    expect(links.filter((e) => e.offsetParent).length).toEqual(7);
  }));

  it('should hide links that the user cannot access', fakeAsync(() => {
    const { el, fixture } = setupTest();

    fixture.detectChanges();
    tick();

    const element: HTMLElement | null = el.querySelector('.noAccessLink a');
    expect(element?.offsetParent).toBeFalsy();
  }));

  it('should check availability when the link changes', fakeAsync(() => {
    const { el, fixture } = setupTest();

    fixture.detectChanges();
    tick();

    const element = el.querySelector('.dynamicLink a');

    expect(element?.getAttribute('hidden')).toBeNull();

    fixture.componentInstance.dynamicLink = 'nope://simple-app/example/page';
    fixture.detectChanges();
    tick();

    expect(element?.getAttribute('hidden')).toBe('hidden');

    fixture.componentInstance.dynamicLink = '1bb-nav://simple-app/allowed';
    fixture.detectChanges();
    tick();

    expect(element?.getAttribute('hidden')).toBeNull();
  }));

  it('should default to local app', fakeAsync(() => {
    const { el, fixture } = setupTest();

    fixture.detectChanges();
    tick();

    const element: HTMLElement | null = el.querySelector('.localLink');
    expect(element?.textContent).toBe('Example');
  }));

  it('should set href without any query parameters', fakeAsync(() => {
    const { el, fixture } = setupTest();

    fixture.detectChanges();
    tick();

    const element: HTMLElement | null = el.querySelector('.simpleLink a');
    expect(element?.getAttribute('href')).toEqual(
      'https://example.com/example/page?query=param',
    );
  }));

  it('should set href with query parameters', fakeAsync(() => {
    const { el, fixture } = setupTest({
      params: {
        asdf: { value: 123 },
        jkl: { value: 'mno' },
      },
    });

    fixture.detectChanges();
    tick();

    const element: HTMLElement | null = el.querySelector('.simpleLink a');
    expect(element?.getAttribute('href')).toEqual(
      'https://example.com/example/page?query=param&asdf=123&jkl=mno',
    );
  }));

  it('should override query parameters', fakeAsync(() => {
    const { el, fixture } = setupTest({
      params: { foo: { value: 'bar' } },
    });

    fixture.componentInstance.dynamicLink =
      '1bb-nav://simple-app/example/page?foo=override';

    fixture.detectChanges();
    tick();

    const element: HTMLElement | null = el.querySelector('.dynamicLink a');
    expect(element?.getAttribute('href')).toEqual(
      'https://example.com/example/page?foo=override&query=param',
    );
  }));

  it('should handle an undefined value', fakeAsync(() => {
    const { el, fixture } = setupTest();

    fixture.detectChanges();
    tick();

    fixture.componentInstance.dynamicLink = undefined;
    fixture.detectChanges();
    tick();

    const element: HTMLElement | null = el.querySelector('.dynamicLink a');
    expect(element?.getAttribute('href')).toBeNull();
  }));

  it('should set href with merged query parameters supplied by the app config', fakeAsync(() => {
    const { el, fixture } = setupTest({
      params: {
        asdf: { value: 123 },
        jkl: { value: 'mno' },
      },
    });

    fixture.detectChanges();
    tick();

    const element: HTMLElement | null = el.querySelector('.simpleLink a');
    expect(element?.getAttribute('href')).toEqual(
      'https://example.com/example/page?query=param&asdf=123&jkl=mno',
    );
  }));

  it('should get params from SkyAppRuntimeConfigParamsProvider if SkyAppConfig undefined', fakeAsync(() => {
    const { el, fixture } = setupTest({
      params: {
        asdf: { value: 123 },
        jkl: { value: 'mno' },
      },
      provideSkyAppConfig: false,
    });

    fixture.detectChanges();
    tick();

    const element = el.querySelector('.simpleLink a');
    expect(element?.getAttribute('href')).toEqual(
      'https://example.com/example/page?query=param&asdf=123&jkl=mno',
    );
  }));

  it('should handle neither SkyAppRuntimeConfigParamsProvider or SkyAppConfig being provided', fakeAsync(() => {
    const { el, fixture } = setupTest({
      params: {
        asdf: { value: 123 },
        jkl: { value: 'mno' },
      },
      provideParamsProvider: false,
      provideSkyAppConfig: false,
    });

    fixture.detectChanges();
    tick();

    const element = el.querySelector('.simpleLink a');

    expect(element?.getAttribute('href')).toEqual(
      'https://example.com/example/page?query=param',
    );
  }));

  it('should handle an error', fakeAsync(() => {
    const { el, fixture } = setupTest({});

    fixture.detectChanges();
    tick();

    const element = el.querySelector('.dynamicLink a');
    expect(element?.getAttribute('hidden')).toBeNull();

    fixture.componentInstance.dynamicLink = 'error://simple-app/example/page';
    fixture.detectChanges();
    tick();

    expect(element?.getAttribute('hidden')).toBe('hidden');

    fixture.componentInstance.dynamicLink = '1bb-nav://simple-app/fixed';
    fixture.detectChanges();
    tick();

    expect(element?.getAttribute('hidden')).toBeNull();

    fixture.componentInstance.dynamicLink = 'reject://simple-app/example/page';
    fixture.detectChanges();
    tick();

    expect(element?.getAttribute('hidden')).toBe('hidden');

    fixture.componentInstance.dynamicLink = '1bb-nav://simple-app/fixed';
    fixture.detectChanges();
    tick();

    expect(element?.getAttribute('hidden')).toBeNull();
  }));

  it('should handle the else parameter', fakeAsync(() => {
    const { el, fixture } = setupTest({});

    fixture.componentInstance.dynamicElse = 'unlink';
    fixture.componentInstance.dynamicLink = 'nope://simple-app/example/page';

    fixture.detectChanges();
    tick();

    const element = el.querySelector('.dynamicLink a') as HTMLAnchorElement;

    expect(element?.hidden).toBeFalse();
    expect(element?.getAttribute('href')).toBeNull();
  }));

  it('should handle link without protocol', fakeAsync(() => {
    const { el, fixture } = setupTest({});

    fixture.componentInstance.dynamicLink = '/example/page';
    fixture.detectChanges();
    tick();

    const element = el.querySelector('.dynamicLink a') as HTMLAnchorElement;
    expect(element?.hidden).toBeFalse();
  }));

  it('should handle link with a fragment', fakeAsync(() => {
    const { el, fixture } = setupTest({});

    fixture.detectChanges();
    tick();

    const element = el.querySelector('.fragmentLink a');

    expect(element?.getAttribute('href')).toEqual(
      'https://success/example/page#foobar',
    );
  }));

  it('should append additional query params', fakeAsync(() => {
    const { el, fixture } = setupTest({
      params: {
        envid: {
          value: 'abc123',
        },
      },
    });

    fixture.componentInstance.queryParams = {
      a: 'foo',
      b: '',
      c: '0',
      d: 'false',
      e: undefined,
    };

    fixture.detectChanges();
    tick();

    const element = el.querySelector('a[data-sky-id="query-params"]');

    expect(element?.getAttribute('href')).toEqual(
      'https://success/example/page?a=foo&b=&c=0&d=false&envid=abc123#foobar',
    );
  }));

  it('should accept several formats for the link', fakeAsync(() => {
    const { el, fixture } = setupTest({});

    fixture.componentInstance.dynamicLink = ['1bb-nav://simple-app', 'allowed'];
    fixture.detectChanges();
    tick();

    const element = el.querySelector('.dynamicLink a');
    expect(element?.getAttribute('hidden')).toBeNull();

    fixture.componentInstance.dynamicLink = [
      'test://simple-app',
      'allowed',
      'to',
      'be',
      'complicated',
    ];

    fixture.detectChanges();
    tick();

    expect(element?.getAttribute('href')).toBe(
      'https://success/allowed/to/be/complicated',
    );
  }));

  it('should handle delayed response', fakeAsync(() => {
    const { el, fixture } = setupTest({});

    fixture.componentInstance.setSlowLink(true);
    fixture.detectChanges();
    tick();

    const element = el.querySelector('.slowLink a') as HTMLAnchorElement;

    expect(element.hidden).toBe(true);

    flush();

    expect(element.hidden).toBe(false);
  }));
});

describe('anchor click event', () => {
  function verifyAnchorClickPrevented(
    fixture: ComponentFixture<HrefDirectiveFixtureComponent>,
    selector: string,
    expectedDefaultPrevented: boolean,
    options?: { pointerEventInit?: PointerEventInit; target?: string },
  ): void {
    const parentEl = fixture.nativeElement.querySelector(
      selector,
    ) as HTMLParagraphElement;
    const anchorEl = parentEl.querySelector('a') as HTMLAnchorElement;

    let actualDefaultPrevented = false;
    parentEl.addEventListener('click', (e) => {
      actualDefaultPrevented = e.defaultPrevented;
    });

    anchorEl.removeAttribute('href');
    if (options?.target) {
      anchorEl.setAttribute('target', options.target);
    }

    if (options?.pointerEventInit) {
      SkyAppTestUtility.fireDomEvent(anchorEl, 'click', {
        customEventInit: options.pointerEventInit,
      });
    } else {
      anchorEl.click();
    }

    expect(actualDefaultPrevented).toEqual(expectedDefaultPrevented);
  }

  it('should abort click if user does not have access to the href', fakeAsync(() => {
    const { fixture } = setupTest();

    fixture.detectChanges();
    tick();

    verifyAnchorClickPrevented(fixture, '.noAccessLink', true);
  }));

  it('should allow click if user has access to the href', fakeAsync(() => {
    const { fixture } = setupTest({
      provideSkyAppConfig: false,
    });

    fixture.detectChanges();
    tick();

    verifyAnchorClickPrevented(fixture, '.simpleLink', false);
  }));

  it('should allow click if user has access to the href and opens in a new window', fakeAsync(() => {
    const { fixture } = setupTest();

    fixture.detectChanges();
    tick();

    verifyAnchorClickPrevented(fixture, '.simpleLink', false, {
      pointerEventInit: { metaKey: true },
    });
  }));

  it('should allow click if user has access to the href and target is not self', fakeAsync(() => {
    const { fixture } = setupTest();

    fixture.detectChanges();
    tick();

    verifyAnchorClickPrevented(fixture, '.simpleLink', false, {
      target: 'foobar',
    });
  }));

  it("should prevent the click and defer it to the anchor's route, if provided", fakeAsync(() => {
    const { fixture } = setupTest({ params: {} });

    const router = TestBed.inject(Router);
    const urlTree = new UrlTree();
    spyOn(router, 'parseUrl').and.returnValue(urlTree);
    const navigateSpy = spyOn(router, 'navigateByUrl');

    fixture.detectChanges();
    tick();

    // Confirm the default behavior of the anchor is prevented.
    verifyAnchorClickPrevented(fixture, '.simpleLink', true);

    // Confirm router navigation is called.
    expect(navigateSpy).toHaveBeenCalledWith(urlTree);
  }));
});
