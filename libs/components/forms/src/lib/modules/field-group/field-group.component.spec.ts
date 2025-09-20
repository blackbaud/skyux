import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';

import { SkyFieldGroupHeadingLevel } from './field-group-heading-level';
import { SkyFieldGroupHeadingStyle } from './field-group-heading-style';
import { FieldGroupComponent } from './fixtures/field-group.component.fixture';

describe('Field group component', function () {
  function getLegend(fieldGroupFixture: ComponentFixture<any>): HTMLElement {
    return fieldGroupFixture.nativeElement.querySelector('legend');
  }

  function getFieldGroup(
    fieldGroupFixture: ComponentFixture<any>,
  ): HTMLElement {
    return fieldGroupFixture.nativeElement.querySelector('sky-field-group');
  }

  let fixture: ComponentFixture<FieldGroupComponent>;
  let componentInstance: FieldGroupComponent;

  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [FieldGroupComponent, SkyHelpTestingModule],
    });

    fixture = TestBed.createComponent(FieldGroupComponent);
    componentInstance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should render the field group heading text', () => {
    const legend = getLegend(fixture);

    expect(legend).toBeVisible();
    expect(legend.textContent?.trim()).toBe('Heading text');
  });

  it('should visually hide the heading text by only displaying it for screen readers when headingHidden is true', () => {
    componentInstance.headingHidden = true;
    fixture.detectChanges();

    const legend = getLegend(fixture);

    expect(legend.textContent?.trim()).toBe('Heading text');
    expect(legend).toHaveClass('sky-screen-reader-only');
  });

  it('should have the xl margin class if stacked is true', () => {
    componentInstance.stacked = true;
    fixture.detectChanges();

    const group = getFieldGroup(fixture);

    expect(group).toHaveClass('sky-field-group-stacked');
  });

  it('should not have the lg margin class if stacked is false', () => {
    const group = getFieldGroup(fixture);

    expect(group).not.toHaveClass('sky-field-group-stacked');
  });

  it('should render the correct heading level and styles', () => {
    const headingLevels: (SkyFieldGroupHeadingLevel | undefined)[] = [
      undefined,
      3,
      4,
    ];
    const headingStyles: (SkyFieldGroupHeadingStyle | undefined)[] = [
      undefined,
      3,
      4,
    ];
    headingLevels.forEach((headingLevel) => {
      headingStyles.forEach((headingStyle) => {
        componentInstance.headingLevel = headingLevel;
        componentInstance.headingStyle = headingStyle;
        fixture.detectChanges();

        const heading = fixture.nativeElement.querySelector(
          `h${headingLevel ?? 3}.sky-font-heading-${headingStyle ?? 3}`,
        );

        expect(heading).toExist();
      });
    });
  });

  it('should display the hint text if `hintText` is set', () => {
    const hintText = 'Hint text for the section.';

    fixture.componentInstance.hintText = hintText;
    fixture.detectChanges();

    const hintEl = fixture.nativeElement.querySelector(
      '.sky-field-group-hint-text',
    );

    expect(hintEl).not.toBeNull();
    expect(hintEl?.textContent.trim()).toBe(hintText);
  });

  it('should render help inline popover', () => {
    componentInstance.helpPopoverContent = 'popover content';
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('sky-help-inline').length,
    ).toBe(1);
  });

  it('should not render help inline popover if title is provided without content', () => {
    componentInstance.helpPopoverTitle = 'popover title';
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('sky-help-inline').length,
    ).toBe(0);

    componentInstance.helpPopoverContent = 'popover content';
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('sky-help-inline').length,
    ).toBe(1);
  });

  it('should render help inline if help key is provided', () => {
    componentInstance.helpPopoverContent = undefined;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.sky-help-inline')).toBeFalsy();

    componentInstance.helpKey = 'helpKey.html';
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.sky-help-inline'),
    ).toBeTruthy();
  });

  it('should set global help config with help key', async () => {
    const helpController = TestBed.inject(SkyHelpTestingController);
    componentInstance.helpKey = 'helpKey.html';

    fixture.detectChanges();

    const helpInlineButton = fixture.nativeElement.querySelector(
      '.sky-help-inline',
    ) as HTMLElement | undefined;
    helpInlineButton?.click();

    await fixture.whenStable();
    fixture.detectChanges();

    helpController.expectCurrentHelpKey('helpKey.html');
  });

  it('should pass accessibility', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
