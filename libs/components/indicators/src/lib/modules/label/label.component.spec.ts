import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyIndicatorDescriptionType } from '../shared/indicator-description-type';

import { SkyLabelFixturesModule } from './fixtures/label-fixtures.module';
import { LabelTestComponent } from './fixtures/label.component.fixture';

describe('Label component', () => {
  function getLabelEl(
    fixture: ComponentFixture<LabelTestComponent>
  ): HTMLDivElement {
    return fixture.nativeElement.querySelector('.sky-label');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabelTestComponent],
      imports: [SkyLabelFixturesModule],
    });
  });

  it('should add the appropriate CSS class based on the label type', () => {
    const fixture = TestBed.createComponent(LabelTestComponent);

    fixture.componentInstance.labelType = 'danger';

    fixture.detectChanges();
    expect(getLabelEl(fixture)).toHaveCssClass('sky-label-danger');
  });

  it("should render the label's contents in the expected location", async () => {
    const fixture = TestBed.createComponent(LabelTestComponent);

    fixture.detectChanges();
    expect(getLabelEl(fixture)).toHaveText('Test label');

    // Accessibility checks
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  describe('with description', () => {
    function validateDescription(
      fixture: ComponentFixture<LabelTestComponent>,
      descriptionType: SkyIndicatorDescriptionType,
      expectedDescription?: string
    ): void {
      fixture.componentInstance.descriptionType = descriptionType;

      fixture.detectChanges();

      const labelEl = getLabelEl(fixture);

      const descriptionEl = labelEl.querySelector(
        '.sky-label-text .sky-screen-reader-only'
      );

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
      validateDescription(
        fixture,
        'custom',
        fixture.componentInstance.customDescription
      );
    });
  });
});
