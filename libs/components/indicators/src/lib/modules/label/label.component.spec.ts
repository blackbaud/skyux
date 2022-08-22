import { TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

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

  it("should render the label's contents in the expected location", async () => {
    const fixture = TestBed.createComponent(LabelTestComponent);
    const el = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();
    expect(el.querySelector('.sky-label')).toHaveText('Test label');

    // Accessibility checks
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should default to "info" when no alert type is specified', async () => {
    const fixture = TestBed.createComponent(LabelTestComponent);
    const cmp = fixture.componentInstance as LabelTestComponent;
    const el = fixture.nativeElement as HTMLElement;

    cmp.labelType = undefined;
    fixture.detectChanges();

    const alertEl = el.querySelector('.sky-label');
    expect(alertEl?.classList.contains('sky-label-info')).toBe(true);
    expect(fixture.nativeElement).toBeAccessible();
  });
});
