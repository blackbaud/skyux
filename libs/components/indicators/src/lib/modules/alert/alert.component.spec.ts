import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyLogService } from '@skyux/core';

import { SkyIndicatorDescriptionType } from '../shared/indicator-description-type';
import { SkyIndicatorIconType } from '../shared/indicator-icon-type';

import { AlertTestComponent } from './fixtures/alert.component.fixture';
import { SkyAlertFixtureModule } from './fixtures/alert.module.fixture';

describe('Alert component', () => {
  function validateDeprecatedCalled(
    deprecatedSpy: jasmine.Spy,
    expected: boolean,
  ): void {
    if (expected) {
      expect(deprecatedSpy).toHaveBeenCalledOnceWith(
        'SkyAlertComponent without `descriptionType`',
        {
          deprecationMajorVersion: 8,
          replacementRecommendation:
            'Always specify a `descriptionType` property.',
        },
      );
    } else {
      expect(deprecatedSpy).not.toHaveBeenCalled();
    }
  }

  function validateIcon(el: HTMLElement, expectedIcon: string): void {
    expect(
      el.querySelector('sky-icon-svg')?.getAttribute('data-sky-icon'),
    ).toBe(expectedIcon);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAlertFixtureModule],
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

  it('should show the expected icon', () => {
    const fixture = TestBed.createComponent(AlertTestComponent);
    const cmp = fixture.componentInstance;
    const el = fixture.nativeElement;

    cmp.alertType = 'danger';
    fixture.detectChanges();

    validateIcon(el, 'warning');

    cmp.alertType = 'info';
    fixture.detectChanges();

    validateIcon(el, 'info');

    cmp.alertType = 'success';
    fixture.detectChanges();

    validateIcon(el, 'success');

    cmp.alertType = 'warning';
    fixture.detectChanges();

    validateIcon(el, 'warning');
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

  it('should warn when descriptionType is not set on render', () => {
    const logSvc = TestBed.inject(SkyLogService);
    const deprecatedSpy = spyOn(logSvc, 'deprecated');

    const fixture = TestBed.createComponent(AlertTestComponent);
    fixture.componentInstance.descriptionType = undefined;
    fixture.detectChanges();

    validateDeprecatedCalled(deprecatedSpy, true);
  });

  it('should warn when descriptionType is unset after initial render', () => {
    const logSvc = TestBed.inject(SkyLogService);
    const deprecatedSpy = spyOn(logSvc, 'deprecated');

    const fixture = TestBed.createComponent(AlertTestComponent);
    fixture.componentInstance.descriptionType = 'attention';
    fixture.detectChanges();

    validateDeprecatedCalled(deprecatedSpy, false);

    fixture.componentInstance.descriptionType = undefined;
    fixture.detectChanges();

    validateDeprecatedCalled(deprecatedSpy, true);
  });

  describe('with description', () => {
    function validateDescription(
      fixture: ComponentFixture<AlertTestComponent>,
      descriptionType: SkyIndicatorDescriptionType,
      expectedDescription?: string,
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
        fixture.componentInstance.customDescription,
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
});
