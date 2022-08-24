import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyLabelFixturesModule } from './fixtures/label-fixtures.module';
import { LabelTestComponent } from './fixtures/label.component.fixture';

describe('Label component', () => {
  function getLabel(
    fixture: ComponentFixture<LabelTestComponent>
  ): HTMLElement {
    return fixture.nativeElement.querySelector(
      '#label-with-label-type .sky-label'
    );
  }

  function getLabelWithoutLabelType(
    fixture: ComponentFixture<LabelTestComponent>
  ): HTMLElement {
    return fixture.nativeElement.querySelector(
      '#label-without-label-type .sky-label'
    );
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

  it("should render the label's contents in the expected location", async () => {
    const fixture = TestBed.createComponent(LabelTestComponent);
    fixture.componentInstance.labelType = 'info';

    fixture.detectChanges();
    expect(getLabel(fixture)).toHaveText('Test label');

    // Accessibility checks
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should render the correct icon when a `labelType` is given', () => {
    const fixture = TestBed.createComponent(LabelTestComponent);

    fixture.componentInstance.labelType = 'danger';

    fixture.detectChanges();
    expect(getLabel(fixture).querySelector('i')).toHaveCssClass('fa-warning');
  });
  it('should render the correct icon when no `labelType` is given', () => {
    const fixture = TestBed.createComponent(LabelTestComponent);

    fixture.detectChanges();
    expect(getLabelWithoutLabelType(fixture).querySelector('i')).toHaveCssClass(
      'fa-exclamation-circle'
    );
  });
});
