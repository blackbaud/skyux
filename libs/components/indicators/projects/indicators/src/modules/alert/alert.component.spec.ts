import { async, TestBed } from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs';

import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { expect } from '@skyux-sdk/testing';

import { AlertTestComponent } from './fixtures/alert.component.fixture';

import { SkyAlertModule } from '../alert/alert.module';

describe('Alert component', () => {
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      declarations: [AlertTestComponent],
      imports: [SkyAlertModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });
  });

  it('should hide the close button if it is not closeable', async(() => {
    const fixture = TestBed.createComponent(AlertTestComponent);
    const cmp = fixture.componentInstance as AlertTestComponent;
    const el = fixture.nativeElement as HTMLElement;

    cmp.closeable = true;
    fixture.detectChanges();

    const attributes: any = el.querySelector('.sky-alert-close').attributes;
    expect(attributes['hidden']).toBe(undefined);

    cmp.closeable = false;
    fixture.detectChanges();

    expect(attributes['hidden']).not.toBeNull();
    expect(fixture.nativeElement).toBeAccessible();
  }));

  it('should be hidden when the close button is clicked', async(() => {
    const fixture = TestBed.createComponent(AlertTestComponent);
    const cmp = fixture.componentInstance as AlertTestComponent;
    const el = fixture.nativeElement;

    cmp.closeable = true;
    fixture.detectChanges();
    el.querySelector('.sky-alert-close').click();

    expect(el.querySelector('.sky-alert').attributes['hidden']).not.toBeNull();
    expect(cmp.closed).toBe(true);
    expect(fixture.nativeElement).toBeAccessible();
  }));

  it('should allow the screen reader text for the close button to be localizable', async(() => {
    const fixture = TestBed.createComponent(AlertTestComponent);
    const cmp = fixture.componentInstance as AlertTestComponent;
    const el = fixture.nativeElement as HTMLElement;

    cmp.closeable = true;
    fixture.detectChanges();

    const closeEl = el.querySelector('.sky-alert-close');
    expect(closeEl.getAttribute('aria-label')).toBe('Close the alert');
    expect(fixture.nativeElement).toBeAccessible();
  }));

  it('should add the appropriate styling when an alert type is specified', async(() => {
    const fixture = TestBed.createComponent(AlertTestComponent);
    const cmp = fixture.componentInstance as AlertTestComponent;
    const el = fixture.nativeElement as HTMLElement;

    cmp.alertType = 'success';
    fixture.detectChanges();

    const alertEl = el.querySelector('.sky-alert');
    expect(alertEl.classList.contains('sky-alert-success')).toBe(true);
    expect(fixture.nativeElement).toBeAccessible();
  }));

  it('should default to "warning" when no alert type is specified', async(() => {
    const fixture = TestBed.createComponent(AlertTestComponent);
    const cmp = fixture.componentInstance as AlertTestComponent;
    const el = fixture.nativeElement as HTMLElement;

    cmp.alertType = undefined;
    fixture.detectChanges();

    const alertEl = el.querySelector('.sky-alert');
    expect(alertEl.classList.contains('sky-alert-warning')).toBe(true);
    expect(fixture.nativeElement).toBeAccessible();
  }));

  it('should have a role of "alert"', async(() => {
    const fixture = TestBed.createComponent(AlertTestComponent);
    const cmp = fixture.componentInstance as AlertTestComponent;
    const el = fixture.nativeElement as HTMLElement;

    cmp.alertType = undefined;
    fixture.detectChanges();

    const alertEl = el.querySelector('.sky-alert');
    expect(alertEl.getAttribute('role')).toBe('alert');
    expect(fixture.nativeElement).toBeAccessible();
  }));

  describe('in modern theme', () => {
    function validateStackedIcon(
      el: HTMLElement,
      expectedBaseIcon: string,
      expectedTopIcon: string
    ): void {
      const iconEl = el.querySelector('.sky-alert-icon-theme-modern');
      const baseIconEl = iconEl.querySelector('.fa-stack-2x');
      const topIconEl = iconEl.querySelector('.fa-stack-1x');

      expect(baseIconEl.classList.contains('sky-i-' + expectedBaseIcon)).toBe(
        true
      );
      expect(topIconEl.classList.contains('sky-i-' + expectedTopIcon)).toBe(
        true
      );
    }

    beforeEach(() => {
      mockThemeSvc.settingsChange.next({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light
        ),
        previousSettings:
          mockThemeSvc.settingsChange.getValue().currentSettings,
      });
    });

    it('should show the expected icon', async(() => {
      const fixture = TestBed.createComponent(AlertTestComponent);
      const cmp = fixture.componentInstance;
      const el = fixture.nativeElement;

      cmp.alertType = 'danger';
      fixture.detectChanges();

      validateStackedIcon(el, 'triangle-solid', 'exclamation');

      cmp.alertType = 'info';
      fixture.detectChanges();

      validateStackedIcon(el, 'circle-solid', 'help-i');

      cmp.alertType = 'success';
      fixture.detectChanges();

      validateStackedIcon(el, 'circle-solid', 'check');

      cmp.alertType = 'warning';
      fixture.detectChanges();

      validateStackedIcon(el, 'triangle-solid', 'exclamation');
    }));
  });
});
