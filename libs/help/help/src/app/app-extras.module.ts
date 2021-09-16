import {
  APP_INITIALIZER,
  InjectionToken,
  NgModule
} from '@angular/core';

import {
  SkyModalDemoFormComponent,
  HelpWindowRef
} from './lib';

import {
  AppSkyModule
} from './app-sky.module';

import {
  BBHelpModule,
  HelpWidgetService,
  HelpInitializationService
} from './public/public_api';

type HelpMode = 'legacy' | 'menu' | undefined;
const HELP_MODE: InjectionToken<HelpMode> = new InjectionToken<HelpMode>('helpMode');

/**
 * Loads the widget via {@link HelpInitializationService} in similar fashion as `@skyux-sdk/builder`.
 * This is done manually for the local demo in order to differentiate between the local classes from the classes that
 * `@skyux-sdk/builder` is using.
 * Consumers should not mimic this strategy and should leverage {@link SkyuxConfig#help}.
 */
function initFunction(initSvc: HelpInitializationService, helpMode: HelpMode) {
  // TODO provide {@link HelpWidgetConfig#helpUpdateCallback} when omnibar implements that feature.
  return () => {
    const config = (helpMode === undefined) ? {} : { helpMode: helpMode };
    return initSvc.load(config);
  };
}

/**
 * Consumers' version of {@link AppExtrasModule} would normally not contain
 * {@link BBHelpModule}, {@link HelpWidgetService}, {@link HelpInitializationService}, {@link HELP_MODE}, or {@link initFunction}.
 * `@skyux-sdk/builder` would bring each in when the consumer provides a config object (even an empty object) in the
 * `skyuxconfig.json`'s `help` property.
 * This is done here in order to differentiate between the local classes from the classes that `@skyux-sdk/builder` is
 * using.
 */
@NgModule({
  exports: [
    AppSkyModule,
    BBHelpModule
  ],
  providers: [
    HelpWindowRef,
    HelpWidgetService,
    HelpInitializationService,
    // { provide: HELP_MODE, useValue: 'menu' },
    // { provide: HELP_MODE, useValue: 'legacy' },
    { provide: HELP_MODE, useValue: undefined },
    {
      provide: APP_INITIALIZER,
      useFactory: initFunction,
      deps: [HelpInitializationService, HELP_MODE],
      multi: true
    }
  ],
  entryComponents: [
    SkyModalDemoFormComponent
  ]
})
export class AppExtrasModule { }
