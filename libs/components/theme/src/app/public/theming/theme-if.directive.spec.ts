import {
  Component
} from '@angular/core';

import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  BehaviorSubject
} from 'rxjs';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyTheme
} from './theme';

import {
  SkyThemeIfTestComponent
} from './fixtures/theme-if-test.component';

import {
  SkyThemeMode
} from './theme-mode';

import {
  SkyThemeModule
} from '../theme.module';

import {
  SkyThemeService
} from './theme.service';

import {
  SkyThemeSettings
} from './theme-settings';

import {
  SkyThemeSettingsChange
} from './theme-settings-change';

@Component({
  selector: 'app-theme-if-test-projection',
  template: `
    <app-theme-if-test>
      <ng-container class="projectable">
        Example content projection.
      </ng-container>
    </app-theme-if-test>
  `
})
class TestProjectionComponent {}

describe('ThemeIf directive', () => {
  let fixture: ComponentFixture<SkyThemeIfTestComponent>;
  const defaultThemeSettings = new SkyThemeSettings(SkyTheme.presets.default, SkyThemeMode.presets.light);
  const modernThemeSettings = new SkyThemeSettings(SkyTheme.presets.modern, SkyThemeMode.presets.dark);
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>
  };

  beforeEach(() => {
    mockThemeSvc = {
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

    TestBed.configureTestingModule({
      declarations: [
        SkyThemeIfTestComponent,
        TestProjectionComponent
      ],
      imports: [
        SkyThemeModule
      ],
      providers: [
        { provide: SkyThemeService, useValue: mockThemeSvc }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SkyThemeIfTestComponent);
  });

  it('should display nothing if no theme is set', () => {
    expect(fixture.debugElement.nativeElement.querySelectorAll('.sky-theme-if-test').length).toBe(0);
  });

  it('should work with the default theme', async () => {
    mockThemeSvc.settingsChange.next({
      currentSettings: defaultThemeSettings,
      previousSettings: mockThemeSvc.settingsChange.getValue().currentSettings
    });
    return testForElementShowing('default theme');
  });

  it('should work with the modern theme', async () => {
    mockThemeSvc.settingsChange.next({
      currentSettings: modernThemeSettings,
      previousSettings: mockThemeSvc.settingsChange.getValue().currentSettings
    });
    return testForElementShowing('modern theme');
  });

  // Test the scenario where settings change and previously displayed elements need to be hidden.
  it('should reflect theme changes', async () => {
    mockThemeSvc.settingsChange.next({
      currentSettings: defaultThemeSettings,
      previousSettings: mockThemeSvc.settingsChange.getValue().currentSettings
    });
    await testForElementShowing('default theme');
    mockThemeSvc.settingsChange.next({
      currentSettings: modernThemeSettings,
      previousSettings: mockThemeSvc.settingsChange.getValue().currentSettings
    });
    return testForElementShowing('modern theme');
  });

  // Test the scenario where `skyTheme` directive sets a theme and those settings are inherited.
  it('should work when wrapped in Theme directive', async () => {
    await testForWrappedElementShowing('wrapped in default theme');
    fixture.componentInstance.useModernTheme();
    return testForWrappedElementShowing('wrapped in modern theme');
  });

  it('should reflect input changes', async () => {
    fixture.componentInstance.testThemeName = 'default';
    await testForInputElementShowing('This text shown for default theme.');
    mockThemeSvc.settingsChange.next({
      currentSettings: modernThemeSettings,
      previousSettings: mockThemeSvc.settingsChange.getValue().currentSettings
    });
    fixture.detectChanges();
    const inputTestElements = fixture.debugElement.nativeElement.querySelectorAll('.sky-theme-if-input-test');
    expect(inputTestElements.length).toBe(0);

    fixture.componentInstance.testThemeName = 'modern';
    fixture.detectChanges();
    const inputTestElementsUpdated = fixture.debugElement.nativeElement.querySelectorAll('.sky-theme-if-input-test');
    expect(inputTestElementsUpdated.length).toBe(1);
  });

  it('should flip back and forth', async () => {
    const componentFixture = TestBed.createComponent(TestProjectionComponent);
    await testForContentProjectionShowing('default: Example content projection.', componentFixture);
    mockThemeSvc.settingsChange.next({
      currentSettings: modernThemeSettings,
      previousSettings: mockThemeSvc.settingsChange.getValue().currentSettings
    });
    await testForContentProjectionShowing('modern: Example content projection.', componentFixture);
    mockThemeSvc.settingsChange.next({
      currentSettings: defaultThemeSettings,
      previousSettings: mockThemeSvc.settingsChange.getValue().currentSettings
    });
    await testForContentProjectionShowing('default: Example content projection.', componentFixture);
  });

  async function testForElementShowing(expected: string) {
    fixture.detectChanges();
    const elements = fixture.debugElement.nativeElement.querySelectorAll('.sky-theme-if-test');
    expect(elements.length).toBe(1);
    expect(elements[0]).toHaveText(expected);
  }

  async function testForWrappedElementShowing(expected: string) {
    fixture.detectChanges();
    const elements = fixture.debugElement.nativeElement.querySelectorAll('.sky-theme-if-wrapped-test');
    expect(elements.length).toBe(1);
    expect(elements[0]).toHaveText(expected);
  }

  async function testForInputElementShowing(expected: string) {
    fixture.detectChanges();
    const element = fixture.debugElement.nativeElement.querySelector('.sky-theme-if-input-test');
    expect(element).toHaveText(expected);
  }

  async function testForContentProjectionShowing(expected: string, component: ComponentFixture<any>) {
    component.detectChanges();
    const element = component.debugElement.nativeElement.querySelector('.sky-theme-template');
    expect(element).toHaveText(expected);
  }
});
