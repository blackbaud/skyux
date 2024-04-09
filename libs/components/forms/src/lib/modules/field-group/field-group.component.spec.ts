import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

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
      imports: [FieldGroupComponent],
    });

    fixture = TestBed.createComponent(FieldGroupComponent);
    componentInstance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should render the field group label text', () => {
    const legend = getLegend(fixture);

    expect(legend).toBeVisible();
    expect(legend.textContent?.trim()).toBe('Label text');
  });

  it('should visually hide the label text by only displaying it for screen readers when labelHidden is true', () => {
    componentInstance.labelHidden = true;
    fixture.detectChanges();

    const legend = getLegend(fixture);

    expect(legend.textContent?.trim()).toBe('Label text');
    expect(legend).toHaveClass('sky-screen-reader-only');
  });

  it('should have the xl margin class if stacked is true', () => {
    componentInstance.stacked = true;
    fixture.detectChanges();

    const group = getFieldGroup(fixture);

    expect(group).toHaveClass('sky-margin-stacked-xl');
  });

  it('should not have the lg margin class if stacked is false', () => {
    const group = getFieldGroup(fixture);

    expect(group).not.toHaveClass('sky-margin-stacked-xl');
  });

  it('should render the correct heading level and styles', () => {
    [3, 4].forEach((headingLevel) => {
      [3, 4].forEach((headingStyle) => {
        componentInstance.headingLevel = headingLevel;
        componentInstance.headingStyle = headingStyle;
        fixture.detectChanges();

        const heading = fixture.nativeElement.querySelector(
          `h${headingLevel}.sky-font-heading-${headingStyle}`,
        );

        expect(heading).toExist();
      });
    });
  });
  it('should pass accessibility', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
