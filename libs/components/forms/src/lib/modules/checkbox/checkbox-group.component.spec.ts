import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect } from '@skyux-sdk/testing';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';

import { SkyCheckboxGroupHeadingLevel } from './checkbox-group-heading-level';
import { SkyCheckboxGroupHeadingStyle } from './checkbox-group-heading-style';
import { SkyIconCheckboxGroupComponent } from './fixtures/icon-checkbox-group.component';
import { SkyStandardCheckboxGroupComponent } from './fixtures/standard-checkbox-group.component';
import { SkyTemplateDrivenCheckboxGroupComponent } from './fixtures/template-driven-checkbox-group.component';

describe('Checkbox group component', function () {
  function getCheckboxes(
    checkboxGroupFixture: ComponentFixture<any>,
    standard = true,
  ): HTMLElement[] {
    const selector = `.${standard ? 'sky-checkbox-group-stacked' : 'sky-checkbox-group-inline'} sky-checkbox`;
    return checkboxGroupFixture.nativeElement.querySelectorAll(selector);
  }

  function getLegend(checkboxGroupFixture: ComponentFixture<any>): HTMLElement {
    return checkboxGroupFixture.nativeElement.querySelector('legend');
  }

  function getLegendScreenReaderText(
    checkboxGroupFixture: ComponentFixture<any>,
  ): string | undefined | null {
    return getLegend(checkboxGroupFixture).querySelector(
      '.sky-screen-reader-only',
    )?.textContent;
  }

  function getCheckboxGroup(
    checkboxGroupFixture: ComponentFixture<any>,
  ): HTMLElement {
    return checkboxGroupFixture.nativeElement.querySelector(
      'sky-checkbox-group',
    );
  }

  describe('standard checkboxes', () => {
    let fixture: ComponentFixture<SkyStandardCheckboxGroupComponent>;
    let componentInstance: SkyStandardCheckboxGroupComponent;

    beforeEach(function () {
      TestBed.configureTestingModule({
        imports: [SkyStandardCheckboxGroupComponent, SkyHelpTestingModule],
      });

      fixture = TestBed.createComponent(SkyStandardCheckboxGroupComponent);
      componentInstance = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should render the checkboxes in the stacked group', () => {
      const checkboxes = getCheckboxes(fixture);

      expect(checkboxes.length).toBe(3);

      checkboxes.forEach((checkbox) => expect(checkbox).toBeVisible());
    });

    it('should display heading text', () => {
      const legend = getLegend(fixture);

      expect(legend).toBeVisible();
      expect(legend.textContent?.trim()).toBe('Contact method');
    });

    it('should visually hide the heading text by only displaying it for screen readers when headingHidden is true', () => {
      componentInstance.headingHidden = true;
      fixture.detectChanges();

      const legend = getLegend(fixture);

      expect(legend.textContent?.trim()).toBe('Contact method');
      expect(legend).toHaveClass('sky-screen-reader-only');
    });

    it('should render the correct heading level and styles', () => {
      const headingLevels: (SkyCheckboxGroupHeadingLevel | undefined)[] = [
        undefined,
        3,
        4,
        5,
      ];
      const headingStyles: (SkyCheckboxGroupHeadingStyle | undefined)[] = [
        undefined,
        3,
        4,
        5,
      ];
      headingLevels.forEach((headingLevel) => {
        headingStyles.forEach((headingStyle) => {
          componentInstance.headingLevel = headingLevel;
          componentInstance.headingStyle = headingStyle;
          fixture.detectChanges();

          const selector = headingLevel
            ? `h${headingLevel}.sky-font-heading-${headingStyle ?? 4}`
            : `span.sky-font-heading-${headingStyle ?? 4}`;
          const heading = fixture.nativeElement.querySelector(selector);

          expect(heading).toExist();
        });
      });
    });

    it('should display the hint text if `hintText` is set', () => {
      const hintText = 'Hint text for the group.';

      fixture.componentInstance.hintText = hintText;
      fixture.detectChanges();

      const hintEl = fixture.nativeElement.querySelector(
        '.sky-checkbox-group-hint-text',
      );

      expect(hintEl).not.toBeNull();
      expect(hintEl?.textContent.trim()).toBe(hintText);
    });

    it('should have the lg margin class if stacked is true and headingLevel is not set', () => {
      componentInstance.headingLevel = undefined;
      fixture.detectChanges();

      const group = getCheckboxGroup(fixture);

      expect(group).toHaveClass('sky-form-field-stacked');
    });

    it('should have the xl margin class if stacked is true and headingLevel is set', () => {
      const group = getCheckboxGroup(fixture);

      expect(group).toHaveClass('sky-field-group-stacked');
    });

    it('should not have the lg or xl margin class if stacked is false', () => {
      componentInstance.stacked = false;
      fixture.detectChanges();

      const group = getCheckboxGroup(fixture);

      expect(group).not.toHaveClass('sky-form-field-stacked');
      expect(group).not.toHaveClass('sky-field-group-stacked');
    });

    it('should include the asterisk and screen reader text when required', () => {
      componentInstance.required = true;
      fixture.detectChanges();

      const heading = fixture.nativeElement.querySelector(
        '.sky-checkbox-group-heading',
      );

      expect(heading).toHaveClass('sky-control-label-required');
      expect(getLegendScreenReaderText(fixture)).toBe('Required');
    });

    it('should not include the asterisk and screen reader text when required is false', () => {
      fixture.detectChanges();

      const heading = fixture.nativeElement.querySelector(
        '.sky-checkbox-group-heading',
      );

      expect(heading).not.toHaveClass('sky-control-label-required');
      expect(getLegendScreenReaderText(fixture)).toBeUndefined();
    });

    it('should validate that a checkbox is selected when required', () => {
      componentInstance.required = true;
      fixture.detectChanges();

      const checkbox = getCheckboxes(fixture)?.[0];
      const checkboxInput = checkbox?.querySelector('input');

      // check the checkbox to trigger the validation
      checkboxInput?.click();
      fixture.detectChanges();

      // Trigger validation and mark all checkboxes as touched.
      fixture.componentInstance.contactMethod.updateValueAndValidity();
      fixture.componentInstance.contactMethod.markAllAsTouched();
      fixture.detectChanges();

      // uncheck the checkbox to trigger the validation error
      checkboxInput?.click();
      fixture.detectChanges();

      // Trigger validation
      fixture.componentInstance.contactMethod.updateValueAndValidity();
      fixture.detectChanges();

      const formError = fixture.nativeElement.querySelector('sky-form-error');
      expect(formError).toBeVisible();
      expect(formError.textContent).toContain('Contact method is required.');
    });

    it('should validate that a checkbox is selected if checkbox group is no longer required', () => {
      componentInstance.required = true;
      fixture.detectChanges();

      componentInstance.required = false;
      fixture.detectChanges();

      const checkbox = getCheckboxes(fixture)?.[0];
      const checkboxInput = checkbox?.querySelector('input');

      // check and uncheck the checkbox to trigger the validation error
      checkboxInput?.click();
      fixture.detectChanges();

      checkboxInput?.click();
      fixture.detectChanges();

      componentInstance.contactMethod.markAsTouched();
      fixture.detectChanges();

      const formError = fixture.nativeElement.querySelector('sky-form-error');
      expect(formError).toBeNull();
    });

    it('should render custom form errors', () => {
      const checkbox = getCheckboxes(fixture)?.[0];
      const checkboxInput = checkbox?.querySelector('input');

      // check the email checkbox to trigger the validation error
      checkboxInput?.click();
      fixture.detectChanges();

      const formError = fixture.nativeElement.querySelector('sky-form-error');
      expect(formError).toBeVisible();
      expect(formError.textContent).toContain(
        'Email cannot be the only contact method.',
      );
    });

    it('should render help inline popover if helpPopoverContent is provided', () => {
      componentInstance.helpPopoverContent = 'popover content';
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('sky-help-inline'),
      ).toBeTruthy();
    });

    it('should render the help inline button if helpKey is provided', () => {
      componentInstance.helpKey = 'helpKey.html';
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('sky-help-inline'),
      ).toBeTruthy();
    });

    it('should set global help config with help key', async () => {
      const helpController = TestBed.inject(SkyHelpTestingController);
      fixture.componentInstance.helpKey = 'helpKey.html';
      fixture.detectChanges();

      const helpInlineButton = fixture.nativeElement.querySelector(
        '.sky-help-inline',
      ) as HTMLElement | undefined;
      helpInlineButton?.click();

      await fixture.whenStable();
      fixture.detectChanges();

      helpController.expectCurrentHelpKey('helpKey.html');
    });
  });

  describe('template-driven forms', () => {
    let fixture: ComponentFixture<SkyTemplateDrivenCheckboxGroupComponent>;

    beforeEach(function () {
      TestBed.configureTestingModule({
        imports: [SkyTemplateDrivenCheckboxGroupComponent],
      });

      fixture = TestBed.createComponent(
        SkyTemplateDrivenCheckboxGroupComponent,
      );
    });

    it('should validate that a checkbox is selected when required', async () => {
      fixture.componentInstance.required = true;

      fixture.detectChanges();
      await fixture.whenStable();

      fixture.componentInstance.submitForm();
      fixture.detectChanges();

      const formError = fixture.debugElement.query(
        By.css('sky-form-error'),
      ).nativeElement;

      expect(formError).toBeVisible();
      expect(formError.textContent).toContain('Contact method is required.');
    });
  });

  describe('icon checkboxes', () => {
    let fixture: ComponentFixture<SkyIconCheckboxGroupComponent>;

    beforeEach(function () {
      TestBed.configureTestingModule({
        imports: [SkyIconCheckboxGroupComponent],
      });

      fixture = TestBed.createComponent(SkyIconCheckboxGroupComponent);

      fixture.detectChanges();
    });

    it('should render the checkboxes in the inline group', () => {
      const checkboxes = getCheckboxes(fixture, false);

      expect(checkboxes.length).toBe(3);

      checkboxes.forEach((checkbox) => expect(checkbox).toBeVisible());
    });
  });
});
