import { Component } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';

import { expect } from '@skyux-sdk/testing';

import { SkyTheme } from './theme';

import { MockThemeService } from './fixtures/mock-theme.service';

import { SkyThemeIfTestComponent } from './fixtures/theme-if-test.component';

import { SkyThemeMode } from './theme-mode';

import { SkyThemeModule } from '../theme.module';

import { SkyThemeService } from './theme.service';

import { SkyThemeSettings } from './theme-settings';

import { SkyThemeSettingsChange } from './theme-settings-change';

@Component({
  selector: 'app-theme-if-test-projection',
  template: `
    <app-theme-if-test>
      <ng-container class="projectable">
        Example content projection.
      </ng-container>
    </app-theme-if-test>
  `,
})
class TestProjectionComponent {}

const DEFAULT_THEME = new SkyThemeSettings(
  SkyTheme.presets.default,
  SkyThemeMode.presets.light
);
const MODERN_THEME = new SkyThemeSettings(
  SkyTheme.presets.modern,
  SkyThemeMode.presets.light
);

describe('ThemeIf directive', () => {
  //#region helpers
  function expectOnlyElementShowing(
    fixture: ComponentFixture<any>,
    expected: string
  ): void {
    const elements =
      fixture.debugElement.nativeElement.querySelectorAll('.sky-theme-if-test');
    expect(elements.length).toBe(1);
    expect(elements[0]).toHaveText(expected);
  }

  function testForWrappedElementShowing(
    fixture: ComponentFixture<any>,
    expected: string
  ): void {
    fixture.detectChanges();
    const elements = fixture.debugElement.nativeElement.querySelectorAll(
      '.sky-theme-if-wrapped-test'
    );
    expect(elements.length).toBe(1);
    expect(elements[0]).toHaveText(expected);
  }

  function testForInputElementShowing(
    fixture: ComponentFixture<any>,
    expected: string
  ): void {
    fixture.detectChanges();
    const element = getInputTestElement(fixture);
    expect(element).toHaveText(expected);
  }

  function testForContentProjectionShowing(
    fixture: ComponentFixture<any>,
    expected: string
  ): void {
    fixture.detectChanges();
    const element = fixture.debugElement.nativeElement.querySelector(
      '.sky-theme-template'
    );
    expect(element).toHaveText(expected);
  }

  async function changeTheme(
    fixture: ComponentFixture<any>,
    mockThemeSvc: MockThemeService,
    theme: SkyThemeSettings
  ): Promise<void> {
    mockThemeSvc.settingsChange.next({
      currentSettings: theme,
      previousSettings: mockThemeSvc.settingsChange.getValue().currentSettings,
    });
    fixture.detectChanges();
    await fixture.whenStable();
    return;
  }

  function getInputTestElement(fixture: ComponentFixture<any>): HTMLElement {
    return fixture.debugElement.nativeElement.querySelector(
      '.sky-theme-if-input-test'
    );
  }
  //#endregion

  describe('without SkyThemeService provider', () => {
    let fixture: ComponentFixture<SkyThemeIfTestComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [SkyThemeIfTestComponent, TestProjectionComponent],
        imports: [SkyThemeModule],
      }).compileComponents();
      fixture = TestBed.createComponent(SkyThemeIfTestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    // Establish that our test is set up correctly.
    it('should not have a SkyThemeService provider', () => {
      expect(() => TestBed.inject(SkyThemeService)).toThrowError(
        /No provider for SkyThemeService/
      );
    });

    it('should show default theme content only', () => {
      expectOnlyElementShowing(fixture, 'default theme');
    });
  });

  describe('with SkyThemeService provider', () => {
    let fixture: ComponentFixture<SkyThemeIfTestComponent>;
    let mockThemeSvc: MockThemeService;

    beforeEach(async () => {
      mockThemeSvc = new MockThemeService();
      mockThemeSvc.settingsChange = new BehaviorSubject<SkyThemeSettingsChange>(
        {
          currentSettings: DEFAULT_THEME,
          previousSettings: undefined,
        }
      );

      await TestBed.configureTestingModule({
        declarations: [SkyThemeIfTestComponent, TestProjectionComponent],
        imports: [SkyThemeModule],
        providers: [{ provide: SkyThemeService, useValue: mockThemeSvc }],
      }).compileComponents();
      fixture = TestBed.createComponent(SkyThemeIfTestComponent);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    // Establish that our test is set up correctly.
    it('should have a SkyThemeService provider', () => {
      expect(() => TestBed.inject(SkyThemeService)).not.toThrowError(
        /No provider for SkyThemeService/
      );
    });

    it('should update template when SkyThemeService changes to default theme', async () => {
      await changeTheme(fixture, mockThemeSvc, DEFAULT_THEME);
      expectOnlyElementShowing(fixture, 'default theme');
    });

    it('should update template when SkyThemeService changes to modern theme', async () => {
      await changeTheme(fixture, mockThemeSvc, MODERN_THEME);
      expectOnlyElementShowing(fixture, 'modern theme');
    });

    it('should update template with content that was previously hidden', async () => {
      await changeTheme(fixture, mockThemeSvc, MODERN_THEME);
      await changeTheme(fixture, mockThemeSvc, DEFAULT_THEME);
      expectOnlyElementShowing(fixture, 'default theme');
    });

    // Test the scenario where `skyTheme` directive sets a theme and those settings are inherited.
    it('should work when wrapped in Theme directive', async () => {
      testForWrappedElementShowing(fixture, 'wrapped in default theme');
      fixture.componentInstance.useModernTheme();
      fixture.detectChanges();
      await fixture.whenStable();
      testForWrappedElementShowing(fixture, 'wrapped in modern theme');
    });

    it('should reflect input changes', async () => {
      fixture.componentInstance.testThemeName = 'default';
      testForInputElementShowing(fixture, 'This text shown for default theme.');
      await changeTheme(fixture, mockThemeSvc, MODERN_THEME);
      const inputTestElements = getInputTestElement(fixture);

      expect(inputTestElements).toBeNull();

      fixture.componentInstance.testThemeName = 'modern';
      fixture.detectChanges();
      const inputTestElementsUpdated = getInputTestElement(fixture);
      expect(inputTestElementsUpdated).not.toBeNull();
    });

    it('should properly display projected content when changing between themes', async () => {
      const componentFixture = TestBed.createComponent(TestProjectionComponent);
      testForContentProjectionShowing(
        componentFixture,
        'default: Example content projection.'
      );

      await changeTheme(fixture, mockThemeSvc, MODERN_THEME);
      testForContentProjectionShowing(
        componentFixture,
        'modern: Example content projection.'
      );

      await changeTheme(fixture, mockThemeSvc, DEFAULT_THEME);
      testForContentProjectionShowing(
        componentFixture,
        'default: Example content projection.'
      );
    });
  });

  describe('with uninitialized SkyThemeService provider', () => {
    it('should use the default theme if the theme service is not initialized', async () => {
      TestBed.configureTestingModule({
        declarations: [SkyThemeIfTestComponent, TestProjectionComponent],
        imports: [SkyThemeModule],
        providers: [
          {
            provide: SkyThemeService,
            useValue: new SkyThemeService(),
          },
        ],
      });
      const fixture = TestBed.createComponent(SkyThemeIfTestComponent);
      fixture.detectChanges();
      expectOnlyElementShowing(fixture, 'default theme');
    });
  });
});
