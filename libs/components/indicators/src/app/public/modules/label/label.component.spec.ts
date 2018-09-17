import {
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@blackbaud/skyux-builder/runtime/testing/browser';

import { SkyLabelFixturesModule } from './fixtures/label-fixtures.module';
import { LabelTestComponent } from './fixtures/label.component.fixture';

describe('Label component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyLabelFixturesModule
      ]
    });
  });

  it('should add the appropriate CSS class based on the label type', () => {
    let fixture = TestBed.createComponent(LabelTestComponent);
    let el = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    expect(el.querySelector('.sky-label')).toHaveCssClass('sky-label-danger');
  });

  it('should render the label\'s contents in the expected location', () => {
    let fixture = TestBed.createComponent(LabelTestComponent);
    let el = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    expect(el.querySelector('.sky-label')).toHaveText('Test label');
  });
});
