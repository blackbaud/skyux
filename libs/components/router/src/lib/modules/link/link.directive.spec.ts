import { Component, DebugElement } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { RouterTestingModule } from '@angular/router/testing';

import { SkyAppConfig, SkyAppRuntimeConfigParamsProvider } from '@skyux/config';

import { SkyAppLinkDirective } from './link.directive';

@Component({
  template: '<a skyAppLink="test">Test</a>',
})
class SkyAppLinkTestComponent {}

@Component({
  template:
    '<a skyAppLink="test" [queryParams]="{qp1: 1, qp2: false}">Test</a>',
})
class SkyAppLinkWithParamsTestComponent {}

describe('SkyAppLink Directive', () => {
  let fixture: ComponentFixture<SkyAppLinkTestComponent>;
  let debugElement: DebugElement;
  let getAllParam: boolean;

  function setup(
    params: any,
    useQueryParams: boolean,
    provideSkyAppConfig = true
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
            useValue: {
              params: {
                getAll() {
                  return params;
                },
              },
            },
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
    expect(directive.properties['href']).toEqual('/test');
  });

  it('should set href with queryParams', () => {
    setup(
      {
        asdf: 123,
        jkl: 'mno',
      },
      false
    );
    const directive = debugElement.query(By.directive(SkyAppLinkDirective));
    expect(directive.attributes['skyAppLink']).toEqual('test');
    expect(directive.properties['href']).toEqual('/test?asdf=123&jkl=mno');
  });

  it('should set href with queryParams supplied by the queryParams attribute', () => {
    setup({}, true);
    const directive = debugElement.query(By.directive(SkyAppLinkDirective));
    expect(directive.attributes['skyAppLink']).toEqual('test');
    expect(directive.properties['href']).toEqual('/test?qp1=1&qp2=false');
  });

  it('should set href with merged queryParams supplied by the queryParams attribute and app config', () => {
    setup(
      {
        asdf: 123,
        jkl: 'mno',
      },
      true
    );
    const directive = debugElement.query(By.directive(SkyAppLinkDirective));
    expect(directive.attributes['skyAppLink']).toEqual('test');
    expect(directive.properties['href']).toEqual(
      '/test?qp1=1&qp2=false&asdf=123&jkl=mno'
    );
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
      false
    );
    const directive = debugElement.query(By.directive(SkyAppLinkDirective));
    expect(directive.properties['href']).toEqual(
      '/test?qp1=1&qp2=false&asdf=123&jkl=mno'
    );
  });
});
