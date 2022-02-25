import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';

import { expect } from '@skyux-sdk/testing';

import { SkyTheme } from './theme';

import { MockThemeService } from './fixtures/mock-theme.service';

import { SkyThemeClassTestComponent } from './fixtures/theme-class-test.component';

import { SkyThemeMode } from './theme-mode';

import { SkyThemeModule } from '../theme.module';

import { SkyThemeService } from './theme.service';

import { SkyThemeSettings } from './theme-settings';

import { SkyThemeSettingsChange } from './theme-settings-change';

const DEFAULT_THEME = new SkyThemeSettings(
  SkyTheme.presets.default,
  SkyThemeMode.presets.light
);
const MODERN_THEME = new SkyThemeSettings(
  SkyTheme.presets.modern,
  SkyThemeMode.presets.light
);

describe('ThemeClass directive', () => {
  //#region helpers
  function expectElementWithClasses(
    fixture: ComponentFixture<any>,
    selector: string,
    expected: string
  ): void {
    const element = fixture.debugElement.nativeElement.querySelector(selector);
    expected
      .split(' ')
      .forEach((className) => expect(element).toHaveCssClass(className));
  }

  async function changeTheme(
    fixture: ComponentFixture<any>,
    mockThemeSvc: MockThemeService,
    theme: SkyThemeSettings
  ): Promise<void> {
    mockThemeSvc.settingsChange!.next({
      currentSettings: theme,
      previousSettings: mockThemeSvc.settingsChange!.getValue().currentSettings,
    });
    fixture.detectChanges();
    await fixture.whenStable();
    return;
  }
  //#endregion

  describe('without SkyThemeService provider', () => {
    let fixture: ComponentFixture<SkyThemeClassTestComponent>;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        declarations: [SkyThemeClassTestComponent],
        imports: [SkyThemeModule],
      });
      fixture = TestBed.createComponent(SkyThemeClassTestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    // Establish that our test is set up correctly.
    it('should not have a SkyThemeService provider', () => {
      expect(() => TestBed.inject(SkyThemeService)).toThrowError(
        /No provider for SkyThemeService/
      );
    });

    it('should show default class', () => {
      fixture.componentInstance.className = 'sky-theme-class-test';
      fixture.detectChanges();
      expectElementWithClasses(
        fixture,
        '.sky-theme-class-test',
        'example-default'
      );
    });
  });

  describe('with SkyThemeService provider', () => {
    let fixture: ComponentFixture<SkyThemeClassTestComponent>;
    let mockThemeSvc: MockThemeService;

    beforeEach(async () => {
      mockThemeSvc = new MockThemeService();
      mockThemeSvc.settingsChange = new BehaviorSubject<SkyThemeSettingsChange>(
        {
          currentSettings: DEFAULT_THEME,
          previousSettings: undefined,
        }
      );

      TestBed.configureTestingModule({
        declarations: [SkyThemeClassTestComponent],
        imports: [SkyThemeModule],
        providers: [{ provide: SkyThemeService, useValue: mockThemeSvc }],
      });
      fixture = TestBed.createComponent(SkyThemeClassTestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    // Establish that our test is set up correctly.
    it('should have a SkyThemeService provider', () => {
      expect(() => TestBed.inject(SkyThemeService)).not.toThrowError(
        /No provider for SkyThemeService/
      );
    });

    it('should not change provided class and ngClass values', () => {
      expectElementWithClasses(
        fixture,
        '.sky-theme-class-test',
        'sky-theme-class-test added-ng-class'
      );
    });

    it('should show default class when SkyThemeService is set to default', async () => {
      await changeTheme(fixture, mockThemeSvc, DEFAULT_THEME);
      expectElementWithClasses(
        fixture,
        '.sky-theme-class-test',
        'sky-theme-class-test added-ng-class example-default'
      );
    });

    it('should show modern class when SkyThemeService is set to modern', async () => {
      await changeTheme(fixture, mockThemeSvc, MODERN_THEME);
      expectElementWithClasses(
        fixture,
        '.sky-theme-class-test',
        'sky-theme-class-test added-ng-class example-modern'
      );
    });

    it('should update classes with that were previously hidden', async () => {
      await changeTheme(fixture, mockThemeSvc, DEFAULT_THEME);
      await changeTheme(fixture, mockThemeSvc, MODERN_THEME);
      expectElementWithClasses(
        fixture,
        '.sky-theme-class-test',
        'sky-theme-class-test added-ng-class example-modern'
      );
    });

    it('should not prevent class changes via a class input directive', async () => {
      fixture.componentInstance.className = 'sky-theme-class-test hello-world';
      fixture.detectChanges();
      expectElementWithClasses(
        fixture,
        '.sky-theme-class-test',
        'added-ng-class example-default hello-world sky-theme-class-test'
      );

      await changeTheme(fixture, mockThemeSvc, MODERN_THEME);
      expectElementWithClasses(
        fixture,
        '.sky-theme-class-test',
        'added-ng-class example-modern hello-world sky-theme-class-test'
      );
    });

    it('should handle undefined class value', async () => {
      fixture.componentInstance.className = undefined;
      fixture.detectChanges();
      expectElementWithClasses(
        fixture,
        'div:first-child',
        'added-ng-class example-default'
      );
    });

    // Test the scenario where `skyTheme` directive sets a theme and those settings are inherited.
    it('should work when wrapped in skyTheme directive', async () => {
      expectElementWithClasses(
        fixture,
        '.sky-theme-class-wrapped-test',
        'sky-theme-class-wrapped-test example-default'
      );

      fixture.componentInstance.useModernTheme();
      fixture.detectChanges();
      await fixture.whenStable();
      expectElementWithClasses(
        fixture,
        '.sky-theme-class-wrapped-test',
        'sky-theme-class-wrapped-test example-modern'
      );
    });
  });

  describe('with SkyThemeService provider', () => {
    it('should use the default theme if the theme service is not initialized', async () => {
      TestBed.configureTestingModule({
        declarations: [SkyThemeClassTestComponent],
        imports: [SkyThemeModule],
        providers: [
          {
            provide: SkyThemeService,
            useValue: new SkyThemeService(),
          },
        ],
      });
      const fixture = TestBed.createComponent(SkyThemeClassTestComponent);
      fixture.detectChanges();
      expectElementWithClasses(
        fixture,
        '.sky-theme-class-test',
        'example-default'
      );
    });
  });
});
