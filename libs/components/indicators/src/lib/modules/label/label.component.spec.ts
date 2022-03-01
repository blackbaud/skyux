import { TestBed, async } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyLabelFixturesModule } from './fixtures/label-fixtures.module';
import { LabelTestComponent } from './fixtures/label.component.fixture';

describe('Label component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyLabelFixturesModule],
    });
  });

  it('should add the appropriate CSS class based on the label type', () => {
    const fixture = TestBed.createComponent(LabelTestComponent);
    const el = fixture.nativeElement as HTMLElement;

    fixture.componentInstance.labelType = 'danger';

    fixture.detectChanges();
    expect(el.querySelector('.sky-label')).toHaveCssClass('sky-label-danger');
  });

  it("should render the label's contents in the expected location", async(() => {
    const fixture = TestBed.createComponent(LabelTestComponent);
    const el = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
    expect(el.querySelector('.sky-label')).toHaveText('Test label');

    // Accessibility checks
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
