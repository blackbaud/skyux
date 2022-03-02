import { Component, DebugElement, Provider } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  SkyAppConfig,
  SkyAppConfigHost,
  SkyAppRuntimeConfigParamsProvider,
} from '@skyux/config';
import { SkyAppWindowRef } from '@skyux/core';

import { SkyAppLinkExternalDirective } from './link-external.directive';

@Component({
  template: '<a skyAppLinkExternal="test">Test</a>',
})
class SkyAppLinkExternalTestComponent {}

@Component({
  template:
    '<a skyAppLinkExternal="test" [queryParams]="{qp1: 1, qp2: false}">Test</a>',
})
class SkyAppLinkExternalWithParamsTestComponent {}

const testUrl = 'testUrl';

describe('SkyAppLinkExternal Directive', () => {
  let fixture: ComponentFixture<SkyAppLinkExternalTestComponent>;
  let debugElement: DebugElement;

  class MockWindowService {
    constructor(private name: string) {}

    public get nativeWindow(): any {
      return {
        window: {
          name: this.name,
        },
      };
    }
  }

  function setup(
    params: any,
    windowName: string,
    useQueryParams: boolean,
    provideSkyAppConfig = true
  ): void {
    const mockWindowService = new MockWindowService(windowName);
    const componentToUse = useQueryParams
      ? SkyAppLinkExternalWithParamsTestComponent
      : SkyAppLinkExternalTestComponent;

    const providers: Provider[] = [
      {
        provide: SkyAppWindowRef,
        useValue: mockWindowService,
      },
    ];

    if (provideSkyAppConfig) {
      providers.push({
        provide: SkyAppConfig,
        useValue: {
          runtime: {
            params: {
              getAll: (omit: boolean) => (omit ? {} : params),
            },
          },
          skyux: {
            host: {
              url: testUrl,
            },
          },
        },
      });
    } else {
      providers.push({
        provide: SkyAppRuntimeConfigParamsProvider,
        useValue: {
          params: {
            getAll: (omit: boolean) => (omit ? {} : params),
          },
        },
      });
      providers.push({
        provide: SkyAppConfigHost,
        useValue: {
          host: {
            url: 'https://foo.bar.baz/',
          },
        },
      });
    }

    TestBed.configureTestingModule({
      declarations: [
        SkyAppLinkExternalDirective,
        SkyAppLinkExternalTestComponent,
        SkyAppLinkExternalWithParamsTestComponent,
      ],
      imports: [RouterTestingModule],
      providers,
    });

    fixture = TestBed.createComponent(componentToUse);
    debugElement = fixture.debugElement;

    fixture.detectChanges(); // initial binding
  }

  it('should set the target to _top when the window name is null', () => {
    setup({}, undefined, false);
    const directive = debugElement.query(
      By.directive(SkyAppLinkExternalDirective)
    );
    expect(directive.attributes['target']).toEqual('_top');
    expect(directive.properties['href']).toEqual('testUrl/test');
  });

  it('should set the target to _top when the window name is an empty string', () => {
    setup({}, '', false);
    const directive = debugElement.query(
      By.directive(SkyAppLinkExternalDirective)
    );
    expect(directive.attributes['target']).toEqual('_top');
    expect(directive.properties['href']).toEqual('testUrl/test');
  });

  it('should set the target to the name of the frame if it has one', () => {
    const windowName = 'windowName';
    setup({}, windowName, false);
    const directive = debugElement.query(
      By.directive(SkyAppLinkExternalDirective)
    );
    expect(directive.attributes['target']).toEqual(windowName);
    expect(directive.properties['href']).toEqual('testUrl/test');
  });

  it('should set href with app config queryParams', () => {
    setup(
      {
        asdf: 123,
        jkl: 'mno',
      },
      '',
      false
    );
    const directive = debugElement.query(
      By.directive(SkyAppLinkExternalDirective)
    );
    expect(directive.attributes['skyAppLinkExternal']).toEqual('test');
    expect(directive.properties['href']).toEqual(
      'testUrl/test?asdf=123&jkl=mno'
    );
  });

  it('should set href with queryParams supplied by the queryParams attribute', () => {
    setup({}, '', true);
    const directive = debugElement.query(
      By.directive(SkyAppLinkExternalDirective)
    );
    expect(directive.attributes['skyAppLinkExternal']).toEqual('test');
    expect(directive.properties['href']).toEqual(
      'testUrl/test?qp1=1&qp2=false'
    );
  });

  it('should set href with merged queryParams supplied by the queryParams attribute and app config', () => {
    setup(
      {
        asdf: 123,
        jkl: 'mno',
      },
      '',
      true
    );
    const directive = debugElement.query(
      By.directive(SkyAppLinkExternalDirective)
    );
    expect(directive.attributes['skyAppLinkExternal']).toEqual('test');
    expect(directive.properties['href']).toEqual(
      'testUrl/test?qp1=1&qp2=false&asdf=123&jkl=mno'
    );
  });

  it('should get config from separate providers if SkyAppConfig undefined', () => {
    setup(
      {
        asdf: 123,
        jkl: 'mno',
      },
      '',
      true,
      false
    );
    const directive = debugElement.query(
      By.directive(SkyAppLinkExternalDirective)
    );
    expect(directive.properties['href']).toEqual(
      'https://foo.bar.baz/test?qp1=1&qp2=false&asdf=123&jkl=mno'
    );
  });
});
