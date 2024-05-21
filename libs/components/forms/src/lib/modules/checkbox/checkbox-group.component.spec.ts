import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';

import { SkyIconCheckboxGroupComponent } from './fixtures/icon-checkbox-group.component';
import { SkyStandardCheckboxGroupComponent } from './fixtures/standard-checkbox-group.component';

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

    it('should display label text', () => {
      const legend = getLegend(fixture);

      expect(legend).toBeVisible();
      expect(legend.textContent?.trim()).toBe('Contact method');
    });

    it('should visually hide the label text by only displaying it for screen readers when labelHidden is true', () => {
      componentInstance.labelHidden = true;
      fixture.detectChanges();

      const legend = getLegend(fixture);

      expect(legend.textContent?.trim()).toBe('Contact method');
      expect(legend).toHaveClass('sky-screen-reader-only');
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

    it('should have the lg margin class if stacked is true', () => {
      const group = getCheckboxGroup(fixture);

      expect(group).toHaveClass('sky-margin-stacked-lg');
    });

    it('should not have the lg margin class if stacked is false', () => {
      componentInstance.stacked = false;
      fixture.detectChanges();

      const group = getCheckboxGroup(fixture);

      expect(group).not.toHaveClass('sky-margin-stacked-lg');
    });

    it('should include the asterisk and screen reader text when required', () => {
      componentInstance.required = true;
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector(
        'span.sky-margin-inline-xs',
      );

      expect(label).toHaveClass('sky-control-label-required');
      expect(getLegendScreenReaderText(fixture)).toBe('Required');
    });

    it('should not include the asterisk and screen reader text when not required', () => {
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector(
        'span.sky-margin-inline-xs',
      );

      expect(label).not.toHaveClass('sky-control-label-required');
      expect(getLegendScreenReaderText(fixture)).toBeUndefined();
    });

    it('should render custom form errors', () => {
      const checkbox = getCheckboxes(fixture)?.[0];
      const checkboxInput = checkbox?.querySelector('input');

      // check and uncheck the checkbox to trigger the validation error
      checkboxInput?.click();
      fixture.detectChanges();

      checkboxInput?.click();
      fixture.detectChanges();

      const formError = fixture.nativeElement.querySelector('sky-form-error');
      expect(formError).toBeVisible();
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
