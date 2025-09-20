import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { BehaviorSubject } from 'rxjs';

import { SkyThemeModule } from '../theme.module';

import { MockThemeService } from './fixtures/mock-theme.service';
import { SkyThemeComponentClassTestComponent } from './fixtures/theme-component-class-test.component';
import { SkyTheme } from './theme';
import { SkyThemeMode } from './theme-mode';
import { SkyThemeSettings } from './theme-settings';
import { SkyThemeSettingsChange } from './theme-settings-change';
import { SkyThemeService } from './theme.service';

const DEFAULT_THEME = new SkyThemeSettings(
  SkyTheme.presets.default,
  SkyThemeMode.presets.light,
);
const MODERN_THEME = new SkyThemeSettings(
  SkyTheme.presets.modern,
  SkyThemeMode.presets.light,
);

describe('ThemeComponentClass directive', () => {
  //#region helpers
  async function changeTheme(
    fixture: ComponentFixture<any>,
    mockThemeSvc: MockThemeService,
    theme: SkyThemeSettings,
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
    let fixture: ComponentFixture<SkyThemeComponentClassTestComponent>;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [SkyThemeComponentClassTestComponent, SkyThemeModule],
      });
      fixture = TestBed.createComponent(SkyThemeComponentClassTestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should default to the default class', () => {
      expect(fixture.nativeElement).toHaveClass('sky-cmp-theme-default');
    });
  });

  describe('with SkyThemeService provider', () => {
    let fixture: ComponentFixture<SkyThemeComponentClassTestComponent>;
    let mockThemeSvc: MockThemeService;

    beforeEach(async () => {
      mockThemeSvc = new MockThemeService();
      mockThemeSvc.settingsChange = new BehaviorSubject<SkyThemeSettingsChange>(
        {
          currentSettings: DEFAULT_THEME,
          previousSettings: undefined,
        },
      );

      TestBed.configureTestingModule({
        imports: [SkyThemeComponentClassTestComponent, SkyThemeModule],
        providers: [{ provide: SkyThemeService, useValue: mockThemeSvc }],
      });
      fixture = TestBed.createComponent(SkyThemeComponentClassTestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should have the default theme class when theme is default', () => {
      expect(fixture.nativeElement).toHaveClass('sky-cmp-theme-default');
    });

    it('should have the modern theme class when theme is modern', async () => {
      await changeTheme(fixture, mockThemeSvc, MODERN_THEME);
      expect(fixture.nativeElement).toHaveClass('sky-cmp-theme-modern');
    });
  });
});
