import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyLogService } from '@skyux/core';

import { SkyIndicatorDescriptionType } from '../shared/indicator-description-type';

import { SkyLabelFixturesModule } from './fixtures/label-fixtures.module';
import { LabelTestComponent } from './fixtures/label.component.fixture';

describe('Label component', () => {
  function getLabel(
    fixture: ComponentFixture<LabelTestComponent>,
  ): HTMLElement {
    return fixture.nativeElement.querySelector(
      '#label-with-label-type .sky-label',
    );
  }

  function getLabelWithoutLabelType(
    fixture: ComponentFixture<LabelTestComponent>,
  ): HTMLElement {
    return fixture.nativeElement.querySelector(
      '#label-without-label-type .sky-label',
    );
  }

  function validateDeprecatedCalled(
    fixture: ComponentFixture<LabelTestComponent>,
    deprecatedSpy: jasmine.Spy,
    expected: boolean,
  ): void {
    if (expected) {
      // Expect one call per label in the test component.
      const callCount = fixture.debugElement.queryAll(
        By.css('sky-label'),
      ).length;

      expect(deprecatedSpy.calls.allArgs()).toEqual(
        new Array(callCount).fill([
          'SkyLabelComponent without `descriptionType`',
          {
            deprecationMajorVersion: 8,
            replacementRecommendation:
              'Always specify a `descriptionType` property.',
          },
        ]),
      );
    } else {
      expect(deprecatedSpy).not.toHaveBeenCalled();
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyLabelFixturesModule],
    });
  });

  it('should add the appropriate CSS class based on the label type', () => {
    const fixture = TestBed.createComponent(LabelTestComponent);

    fixture.componentInstance.labelType = 'danger';

    fixture.detectChanges();
    expect(getLabel(fixture)).toHaveCssClass('sky-label-danger');
  });

  it('should have a default label type', () => {
    const fixture = TestBed.createComponent(LabelTestComponent);

    fixture.componentInstance.labelType = undefined;

    fixture.detectChanges();
    expect(getLabel(fixture)).toHaveCssClass('sky-label-info');
  });

  it("should render the label's contents in the expected location", async () => {
    const fixture = TestBed.createComponent(LabelTestComponent);
    fixture.componentInstance.labelType = 'info';

    fixture.detectChanges();
    expect(getLabel(fixture)).toHaveText('Test label');

    // Accessibility checks
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  describe('with description', () => {
    function validateDescription(
      fixture: ComponentFixture<LabelTestComponent>,
      descriptionType: SkyIndicatorDescriptionType,
      expectedDescription?: string,
    ): void {
      fixture.componentInstance.descriptionType = descriptionType;

      fixture.detectChanges();

      const labelEl = getLabel(fixture);

      const descriptionEl = labelEl.querySelector('.sky-screen-reader-only');

      if (expectedDescription) {
        expect(descriptionEl).toHaveText(expectedDescription);
      } else {
        expect(descriptionEl).not.toExist();
      }
    }

    it('should add the expected screen reader description based on `descriptionType`', () => {
      const fixture = TestBed.createComponent(LabelTestComponent);
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
  });

  it('should warn when descriptionType is not set on render', () => {
    const logSvc = TestBed.inject(SkyLogService);
    const deprecatedSpy = spyOn(logSvc, 'deprecated');

    const fixture = TestBed.createComponent(LabelTestComponent);
    fixture.componentInstance.descriptionType = undefined;
    fixture.detectChanges();

    validateDeprecatedCalled(fixture, deprecatedSpy, true);
  });

  it('should warn when descriptionType is unset after initial render', () => {
    const logSvc = TestBed.inject(SkyLogService);
    const deprecatedSpy = spyOn(logSvc, 'deprecated');

    const fixture = TestBed.createComponent(LabelTestComponent);
    fixture.componentInstance.descriptionType = 'attention';
    fixture.detectChanges();

    validateDeprecatedCalled(fixture, deprecatedSpy, false);

    fixture.componentInstance.descriptionType = undefined;
    fixture.detectChanges();

    validateDeprecatedCalled(fixture, deprecatedSpy, true);
  });

  it('should render the correct icon when a `labelType` is given', () => {
    const fixture = TestBed.createComponent(LabelTestComponent);

    fixture.componentInstance.labelType = 'danger';

    fixture.detectChanges();
    expect(
      getLabel(fixture)
        .querySelector('sky-icon-svg')
        ?.getAttribute('data-sky-icon'),
    ).toBe('warning');
  });

  it('should render the correct icon when no `labelType` is given', () => {
    const fixture = TestBed.createComponent(LabelTestComponent);

    fixture.detectChanges();
    expect(
      getLabelWithoutLabelType(fixture)
        .querySelector('sky-icon-svg')
        ?.getAttribute('data-sky-icon'),
    ).toBe('info');
  });

  describe('a11y', () => {
    it('should be accessible when label type is info', async () => {
      const fixture = TestBed.createComponent(LabelTestComponent);
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when label type is danger', async () => {
      const fixture = TestBed.createComponent(LabelTestComponent);
      const cmp = fixture.componentInstance as LabelTestComponent;
      cmp.labelType = 'danger';
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when label type is success', async () => {
      const fixture = TestBed.createComponent(LabelTestComponent);
      const cmp = fixture.componentInstance as LabelTestComponent;
      cmp.labelType = 'success';
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when label type is warning', async () => {
      const fixture = TestBed.createComponent(LabelTestComponent);
      const cmp = fixture.componentInstance as LabelTestComponent;
      cmp.labelType = 'warning';
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
