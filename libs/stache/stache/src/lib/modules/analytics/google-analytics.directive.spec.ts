import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { expect } from '@skyux-sdk/testing';
import { SkyAppConfig } from '@skyux/config';

import { of as observableOf } from 'rxjs';

import { StacheWindowRef } from '../shared/window-ref';

import { StacheAnalyticsModule } from './analytics.module';
import { StacheGoogleAnalyticsTestComponent } from './fixtures/google-analytics.component.fixture';
import { StacheGoogleAnalyticsDirective } from './google-analytics.directive';

describe('StacheGoogleAnalyticsDirective', () => {
  let fixture: ComponentFixture<StacheGoogleAnalyticsTestComponent>;
  let mockWindowService: any;
  let mockConfigService: any;
  let mockRouter: any;
  let directiveElement: any;

  class MockWindowService {
    public nativeWindow = {
      eval: function () {
        this.ga = () => true;
      },
      ga: false,
      document: {
        getElementById: jasmine
          .createSpy('getElementById')
          .and.callFake(function (id: any) {
            return false;
          }),
      },
    };
  }

  class MockConfigService {
    public runtime = {
      command: 'build',
      app: {
        base: '/test-base/',
      },
    };
    public skyux = {
      appSettings: {
        stache: {
          googleAnalytics: {
            clientId: '',
          },
        },
      },
    };
  }

  class MockRouter {
    public events = observableOf(new NavigationEnd(0, '', ''));
  }

  beforeEach(() => {
    mockWindowService = new MockWindowService();
    mockConfigService = new MockConfigService();
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      declarations: [StacheGoogleAnalyticsTestComponent],
      imports: [StacheAnalyticsModule],
      providers: [
        { provide: SkyAppConfig, useValue: mockConfigService },
        { provide: StacheWindowRef, useValue: mockWindowService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StacheGoogleAnalyticsTestComponent);
    directiveElement = fixture.debugElement.query(
      By.directive(StacheGoogleAnalyticsDirective)
    );
  });

  it('should use config settings over defaults', () => {
    let directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective
    );

    expect(directiveInstance['tagManagerContainerId']).toEqual('GTM-W56QP9');
    expect(directiveInstance['analyticsClientId']).toEqual('UA-2418840-1');
    expect(directiveInstance['isEnabled']).toEqual(true);

    mockConfigService.skyux.appSettings = {
      stache: {
        googleAnalytics: {
          tagManagerContainerId: '1',
          clientId: '2',
          enabled: 'false',
        },
      },
    };

    directiveInstance.updateDefaultConfigs();

    expect(directiveInstance['tagManagerContainerId']).toEqual('1');
    expect(directiveInstance['analyticsClientId']).toEqual('2');
    expect(directiveInstance['isEnabled']).toEqual(false);
  });

  it('should format and store the appName from the runtime.base', () => {
    let directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective
    );
    directiveInstance.updateDefaultConfigs();
    expect(directiveInstance['configService'].runtime.app.base).toEqual(
      '/test-base/'
    );
    expect(directiveInstance['appName']).toEqual('test-base');
  });

  it('should add the Google Tag Manager script if it does not exist, from ngOnInit', () => {
    let directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective
    );
    spyOn(directiveInstance, 'addGoogleTagManagerScript').and.callThrough();
    directiveInstance.ngOnInit();
    expect(directiveInstance.addGoogleTagManagerScript).toHaveBeenCalled();
  });

  it('should run none of the other methods if the GTM script exists already', () => {
    let directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective
    );
    spyOn(directiveInstance, 'addGoogleTagManagerScript').and.callThrough();
    mockWindowService.nativeWindow.ga = () => true;
    directiveInstance.ngOnInit();
    expect(directiveInstance.addGoogleTagManagerScript).not.toHaveBeenCalled();
  });

  it('should handle empty stache config in skyuxconfig.json', () => {
    let directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective
    );
    mockConfigService.skyux.appSettings = undefined;
    spyOn(directiveInstance, 'addGoogleTagManagerScript').and.callThrough();
    directiveInstance.ngOnInit();
    expect(directiveInstance.addGoogleTagManagerScript).toHaveBeenCalled();
  });

  it('should not run if enabled is set to `false`', () => {
    let directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective
    );
    mockConfigService.skyux.appSettings.stache.googleAnalytics.enabled =
      'false';
    spyOn(directiveInstance, 'addGoogleTagManagerScript').and.callThrough();
    directiveInstance.ngOnInit();
    expect(directiveInstance.addGoogleTagManagerScript).not.toHaveBeenCalled();
  });

  it("should not run if enabled is set to `'false'`", () => {
    let directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective
    );
    mockConfigService.skyux.appSettings.stache.googleAnalytics.enabled = false;
    spyOn(directiveInstance, 'addGoogleTagManagerScript').and.callThrough();
    directiveInstance.ngOnInit();
    expect(directiveInstance.addGoogleTagManagerScript).not.toHaveBeenCalled();
  });

  it('should not run if in development mode', () => {
    let directiveInstance = directiveElement.injector.get(
      StacheGoogleAnalyticsDirective
    );
    mockConfigService.runtime.command = 'none';
    spyOn(directiveInstance, 'addGoogleTagManagerScript').and.callThrough();
    fixture.detectChanges();
    expect(directiveInstance.addGoogleTagManagerScript).not.toHaveBeenCalled();
  });
});
