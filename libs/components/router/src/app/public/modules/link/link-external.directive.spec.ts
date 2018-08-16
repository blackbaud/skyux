import {
  Component,
  DebugElement,
  NO_ERRORS_SCHEMA
} from '@angular/core';

import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  By
} from '@angular/platform-browser';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  SkyAppConfig
} from '@skyux/builder-utils/config';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyAppLinkExternalDirective
} from './link-external.directive';

@Component({
  template: '<a skyAppLinkExternal="test">Test</a>'
})
class SkyAppLinkExternalTestComponent { }

@Component({
  template: '<a skyAppLinkExternal="test" [queryParams]="{qp1: 1, qp2: false}">Test</a>'
})
class SkyAppLinkExternalWithParamsTestComponent { }

const testUrl: string = 'testUrl';

describe('SkyAppLinkExternal Directive', () => {
  let fixture: ComponentFixture<SkyAppLinkExternalTestComponent>;
  let debugElement: DebugElement;

  class MockWindowService {
    constructor(
      private name: string
    ) { }

    public get nativeWindow(): any {
      return {
        window: {
          name: this.name
        }
      };
    }
  }

  function setup(
    params: any,
    windowName: string,
    useQueryParams: boolean
  ): void {
    const mockWindowService = new MockWindowService(windowName);
    const componentToUse = useQueryParams ?
      SkyAppLinkExternalWithParamsTestComponent :
      SkyAppLinkExternalTestComponent;

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        SkyAppLinkExternalDirective,
        SkyAppLinkExternalTestComponent,
        SkyAppLinkExternalWithParamsTestComponent
      ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        {
          provide: SkyAppConfig,
          useValue: {
            runtime: {
              params: {
                getAll: () => params
              }
            },
            skyux: {
              host: {
                url: testUrl
              }
            }
          }
        },
        { provide: SkyAppWindowRef, useValue: mockWindowService }
      ]
    });

    fixture = TestBed.createComponent(componentToUse);
    debugElement = fixture.debugElement;

    fixture.detectChanges(); // initial binding
  }

  it('should set the target to _top when the window name is null', () => {
    setup({}, undefined, false);
    const directive = debugElement.query(By.directive(SkyAppLinkExternalDirective));
    expect(directive.attributes['target']).toEqual('_top');
    expect(directive.properties['href']).toEqual('testUrl/test');
  });

  it('should set the target to _top when the window name is an empty string', () => {
    setup({}, '', false);
    const directive = debugElement.query(By.directive(SkyAppLinkExternalDirective));
    expect(directive.attributes['target']).toEqual('_top');
    expect(directive.properties['href']).toEqual('testUrl/test');
  });

  it('should set the target to the name of the frame if it has one', () => {
    const windowName = 'windowName';
    setup({}, windowName, false);
    const directive = debugElement.query(By.directive(SkyAppLinkExternalDirective));
    expect(directive.attributes['target']).toEqual(windowName);
    expect(directive.properties['href']).toEqual('testUrl/test');
  });

  it('should set href with app config queryParams', () => {
    setup({
      asdf: 123,
      jkl: 'mno'
    }, '', false);
    const directive = debugElement.query(By.directive(SkyAppLinkExternalDirective));
    expect(directive.attributes['skyAppLinkExternal']).toEqual('test');
    expect(directive.properties['href']).toEqual('testUrl/test?asdf=123&jkl=mno');
  });

  it('should set href with queryParams supplied by the queryParams attribute', () => {
    setup({}, '', true);
    const directive = debugElement.query(By.directive(SkyAppLinkExternalDirective));
    expect(directive.attributes['skyAppLinkExternal']).toEqual('test');
    expect(directive.properties['href']).toEqual('testUrl/test?qp1=1&qp2=false');
  });

  it('should set href with merged queryParams supplied by the queryParams attribute and app config', () => {
    setup({
      asdf: 123,
      jkl: 'mno'
    }, '', true);
    const directive = debugElement.query(By.directive(SkyAppLinkExternalDirective));
    expect(directive.attributes['skyAppLinkExternal']).toEqual('test');
    expect(directive.properties['href']).toEqual('testUrl/test?qp1=1&qp2=false&asdf=123&jkl=mno');
  });
});
