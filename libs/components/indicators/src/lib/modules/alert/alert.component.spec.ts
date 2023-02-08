import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { SkyIndicatorDescriptionType } from '../shared/indicator-description-type';
import { SkyIndicatorIconType } from '../shared/indicator-icon-type';

import { AlertTestComponent } from './fixtures/alert.component.fixture';
import { SkyAlertFixtureModule } from './fixtures/alert.module.fixture';

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
      imports: [SkyAlertFixtureModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });
  });

  it('should hide the close button if it is not closeable', async () => {
    const fixture = TestBed.createComponent(AlertTestComponent);
    const cmp = fixture.componentInstance as AlertTestComponent;
    const el = fixture.nativeElement as HTMLElement;

    cmp.closeable = true;
    fixture.detectChanges();

    const attributes: NamedNodeMap | undefined =
      el.querySelector('.sky-alert-close')?.attributes;
    expect(attributes?.getNamedItem('hidden')).toBeNull();

    cmp.closeable = false;
    fixture.detectChanges();

    expect(attributes?.getNamedItem('hidden')).not.toBeNull();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should be hidden when the close button is clicked', async () => {
    const fixture = TestBed.createComponent(AlertTestComponent);
    const cmp = fixture.componentInstance as AlertTestComponent;
    const el = fixture.nativeElement;

    cmp.closeable = true;
    fixture.detectChanges();
    el.querySelector('.sky-alert-close').click();

    expect(el.querySelector('.sky-alert').attributes['hidden']).not.toBeNull();
    expect(cmp.closed).toBe(true);
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should allow the screen reader text for the close button to be localized', async () => {
    const fixture = TestBed.createComponent(AlertTestComponent);
    const cmp = fixture.componentInstance as AlertTestComponent;
    const el = fixture.nativeElement as HTMLElement;

    cmp.closeable = true;
    fixture.detectChanges();

    const closeEl = el.querySelector('.sky-alert-close');
    expect(closeEl?.getAttribute('aria-label')).toBe('Close the alert');
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should add the appropriate styling when an alert type is specified', async () => {
    const fixture = TestBed.createComponent(AlertTestComponent);
    const cmp = fixture.componentInstance as AlertTestComponent;
    const el = fixture.nativeElement as HTMLElement;

    cmp.alertType = 'success';
    fixture.detectChanges();

    const alertEl = el.querySelector('.sky-alert');
    expect(alertEl?.classList.contains('sky-alert-success')).toBe(true);
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should default to "warning" when no alert type is specified', async () => {
    const fixture = TestBed.createComponent(AlertTestComponent);
    const cmp = fixture.componentInstance as AlertTestComponent;
    const el = fixture.nativeElement as HTMLElement;

    cmp.alertType = undefined;
    fixture.detectChanges();

    const alertEl = el.querySelector('.sky-alert');
    expect(alertEl?.classList.contains('sky-alert-warning')).toBe(true);
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should have a role of "alert"', async () => {
    const fixture = TestBed.createComponent(AlertTestComponent);
    const cmp = fixture.componentInstance as AlertTestComponent;
    const el = fixture.nativeElement as HTMLElement;

    cmp.alertType = undefined;
    fixture.detectChanges();

    const alertEl = el.querySelector('.sky-alert');
    expect(alertEl?.getAttribute('role')).toBe('alert');
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  describe('with description', () => {
    function validateDescription(
      fixture: ComponentFixture<AlertTestComponent>,
      descriptionType: SkyIndicatorDescriptionType,
      expectedDescription?: string
    ): void {
      fixture.componentInstance.descriptionType = descriptionType;

      fixture.detectChanges();

      const alertEl = fixture.nativeElement.querySelector('.sky-alert');

      const descriptionEl = alertEl.querySelector('.sky-screen-reader-only');

      if (expectedDescription) {
        expect(descriptionEl).toHaveText(expectedDescription);
      } else {
        expect(descriptionEl).not.toExist();
      }
    }

    it('should add the expected screen reader description based on `descriptionType`', () => {
      const fixture = TestBed.createComponent(AlertTestComponent);
      fixture.componentInstance.customDescription = 'Custom description';

      validateDescription(fixture, 'completed', 'Completed:');
      validateDescription(fixture, 'error', 'Error:');
      validateDescription(fixture, 'important-info', 'Important information:');
      validateDescription(fixture, 'none');
      validateDescription(fixture, 'warning', 'Warning:');
      validateDescription(fixture, 'important-warning', 'Important warning:');
      validateDescription(fixture, 'danger', 'Danger:');
      validateDescription(fixture, 'caution', 'Caution:');
      validateDescription(fixture, 'success', 'Success:');
      validateDescription(fixture, 'attention', 'Attention:');
      validateDescription(
        fixture,
        'custom',
        fixture.componentInstance.customDescription
      );
    });

    describe('a11y', () => {
      const alertTypes: (SkyIndicatorIconType | undefined)[] = [
        'danger',
        'info',
        'success',
        'warning',
        undefined,
      ];
      const closeableStates = [true, false, undefined];
      const closedStates: (boolean | undefined)[] = [true, false, undefined];
      const customDescriptionTypes = ['Custom description', undefined];
      const descriptionTypes: (SkyIndicatorDescriptionType | undefined)[] = [
        'attention',
        'caution',
        'completed',
        'custom',
        'danger',
        'error',
        'important-info',
        'important-warning',
        'none',
        'success',
        'warning',
        undefined,
      ];

      for (const closed of closedStates) {
        it(`should be accessible with 'closed': ${closed}`, async () => {
          const fixture = TestBed.createComponent(AlertTestComponent);
          const cmp = fixture.componentInstance as AlertTestComponent;
          const el = fixture.nativeElement;

          cmp.closed = closed;
          fixture.detectChanges();

          await expectAsync(el).toBeAccessible();
        });
      }

      for (const closeable of closeableStates) {
        for (const alertType of alertTypes) {
          it(`should be accessible with 'alertType': ${alertType} and 'closeable': ${closeable}`, async () => {
            const fixture = TestBed.createComponent(AlertTestComponent);
            const cmp = fixture.componentInstance as AlertTestComponent;
            const el = fixture.nativeElement;

            cmp.alertType = alertType;
            cmp.closeable = closeable;
            fixture.detectChanges();

            await expectAsync(el).toBeAccessible();
          });
        }
      }

      for (const descriptionType of descriptionTypes) {
        if (descriptionType === 'custom') {
          for (const customDescription of customDescriptionTypes) {
            it(`should be accessible with 'descriptionType': ${descriptionType}, and 'customDescription': ${customDescription}`, async () => {
              const fixture = TestBed.createComponent(AlertTestComponent);
              const cmp = fixture.componentInstance as AlertTestComponent;
              const el = fixture.nativeElement;

              cmp.descriptionType = descriptionType;
              cmp.customDescription = customDescription;
              fixture.detectChanges();

              await expectAsync(el).toBeAccessible();
            });
          }
        } else {
          it(`should be accessible with 'descriptionType': ${descriptionType}`, async () => {
            const fixture = TestBed.createComponent(AlertTestComponent);
            const cmp = fixture.componentInstance as AlertTestComponent;
            const el = fixture.nativeElement;

            cmp.descriptionType = descriptionType;
            fixture.detectChanges();

            await expectAsync(el).toBeAccessible();
          });
        }
      }
    });
  });

  describe('in modern theme', () => {
    function validateStackedIcon(
      el: HTMLElement,
      expectedBaseIcon: string,
      expectedTopIcon: string
    ): void {
      const iconEl = el.querySelector('.sky-alert-icon-theme-modern');
      const baseIconEl = iconEl?.querySelector('.fa-stack-2x');
      const topIconEl = iconEl?.querySelector('.fa-stack-1x');

      expect(baseIconEl?.classList.contains('sky-i-' + expectedBaseIcon)).toBe(
        true
      );
      expect(topIconEl?.classList.contains('sky-i-' + expectedTopIcon)).toBe(
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

    it('should show the expected icon', async () => {
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
    });
  });
});
