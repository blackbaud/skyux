import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  NoopAnimationsModule
} from '@angular/platform-browser/animations';

import {
  BehaviorSubject
} from 'rxjs';

import {
  SkyInputBoxModule
} from '@skyux/forms';

import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange
} from '@skyux/theme';

import {
  SkyLookupModule
} from '../lookup.module';

import {
  SkyLookupTestComponent
} from './lookup.component.fixture';

import {
  SkyLookupInputBoxTestComponent
} from './lookup-input-box.component.fixture';

import {
  SkyLookupTemplateTestComponent
} from './lookup-template.component.fixture';

export function themeServiceFactory(): any {
  return {
    settingsChange: new BehaviorSubject<SkyThemeSettingsChange>(
      {
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light
        ),
        previousSettings: undefined
      }
    )
  };
}

@NgModule({
  declarations: [
    SkyLookupTestComponent,
    SkyLookupInputBoxTestComponent,
    SkyLookupTemplateTestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterTestingModule,
    SkyInputBoxModule,
    SkyLookupModule,
    NoopAnimationsModule
  ],
  exports: [
    SkyLookupTestComponent,
    SkyLookupTemplateTestComponent
  ],
  providers: [
    {
      provide: SkyThemeService,
      useFactory: themeServiceFactory
    }
  ]
})
export class SkyLookupFixturesModule { }
