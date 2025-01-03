import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyAppConfig, SkyAppRuntimeConfigParamsProvider } from '@skyux/config';

import { SkyAppLinkDirective } from './link.directive';

@Component({
  template: '<a skyAppLink="test">Test</a>',
  standalone: false,
})
class SkyAppLinkTestComponent {}

@Component({
  template:
    '<a skyAppLink="test" [queryParams]="{qp1: 1, qp2: false}">Test</a>',
  standalone: false,
})
class SkyAppLinkWithParamsTestComponent {}

describe('SkyAppLink Directive', () => {
  let fixture: ComponentFixture<SkyAppLinkTestComponent>;
  let debugElement: DebugElement;
  let getAllParam: boolean | undefined;

  function setup(
    params: any,
    useQueryParams: boolean,
    provideSkyAppConfig = true,
    provideParamProvider = true,
  ): void {
    const componentToUse = useQueryParams
      ? SkyAppLinkWithParamsTestComponent
      : SkyAppLinkTestComponent;

    const providers = provideSkyAppConfig
      ? [
          {
            provide: SkyAppConfig,
            useValue: {
              runtime: {
                params: {
                  getAll: (p?: boolean) => {
                    getAllParam = p;
                    return params;
                  },
                },
              },
              skyux: {},
            },
          },
        ]
      : [
          {
            provide: SkyAppRuntimeConfigParamsProvider,
            useValue: provideParamProvider
              ? {
                  params: {
                    getAll() {
                      return params;
                    },
                  },
                }
              : undefined,
          },
        ];

    TestBed.configureTestingModule({
      declarations: [
        SkyAppLinkDirective,
        SkyAppLinkTestComponent,
        SkyAppLinkWithParamsTestComponent,
      ],
      imports: [RouterTestingModule],
      providers,
    });

    fixture = TestBed.createComponent(componentToUse);
    debugElement = fixture.debugElement;

    fixture.detectChanges(); // initial binding
  }

  it('should set href without any queryParams', () => {
    setup({}, false);
    const directive = debugElement.query(By.directive(SkyAppLinkDirective));
    expect(directive.attributes['skyAppLink']).toEqual('test');
    expect(directive.properties['href'].endsWith('/test')).toBeTrue();
  });

  it('should set href with queryParams', () => {
    setup(
      {
        asdf: 123,
        jkl: 'mno',
      },
      false,
    );
    const directive = debugElement.query(By.directive(SkyAppLinkDirective));
    expect(directive.attributes['skyAppLink']).toEqual('test');
    expect(
      directive.properties['href'].endsWith('/test?asdf=123&jkl=mno'),
    ).toBeTrue();
  });

  it('should set href with queryParams supplied by the queryParams attribute', () => {
    setup({}, true);
    const directive = debugElement.query(By.directive(SkyAppLinkDirective));
    expect(directive.attributes['skyAppLink']).toEqual('test');
    expect(
      directive.properties['href'].endsWith('/test?qp1=1&qp2=false'),
    ).toBeTrue();
  });

  it('should set href with merged queryParams supplied by the queryParams attribute and app config', () => {
    setup(
      {
        asdf: 123,
        jkl: 'mno',
      },
      true,
    );
    const directive = debugElement.query(By.directive(SkyAppLinkDirective));
    expect(directive.attributes['skyAppLink']).toEqual('test');
    expect(
      directive.properties['href'].endsWith(
        '/test?qp1=1&qp2=false&asdf=123&jkl=mno',
      ),
    ).toBeTrue();
  });

  it('should call getAll with excludeDefaults set to true', () => {
    setup({}, true);
    debugElement.query(By.directive(SkyAppLinkDirective));
    expect(getAllParam).toBe(true);
  });

  it('should get params from SkyAppRuntimeConfigParamsProvider if SkyAppConfig undefined', () => {
    setup(
      {
        asdf: 123,
        jkl: 'mno',
      },
      true,
      false,
    );
    const directive = debugElement.query(By.directive(SkyAppLinkDirective));
    expect(
      directive.properties['href'].endsWith(
        '/test?qp1=1&qp2=false&asdf=123&jkl=mno',
      ),
    ).toBeTrue();
  });

  it('should handle neither SkyAppConfig or SkyAppRuntimeConfigParamsProvider being provided', () => {
    setup(
      {
        asdf: 123,
        jkl: 'mno',
      },
      true,
      false,
      false,
    );
    const directive = debugElement.query(By.directive(SkyAppLinkDirective));
    expect(directive.attributes['skyAppLink']).toEqual('test');
    expect(
      directive.properties['href'].endsWith('/test?qp1=1&qp2=false'),
    ).toBeTrue();
  });
});
