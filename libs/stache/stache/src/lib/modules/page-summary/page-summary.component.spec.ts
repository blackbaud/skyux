import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  StachePageSummaryModule
} from './page-summary.module';

import {
  StachePageSummaryTestComponent
} from './fixtures/page-summary.component.fixture';

describe('StachePageSummaryComponent', () => {
  let fixture: ComponentFixture<StachePageSummaryTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StachePageSummaryModule
      ],
      declarations: [
        StachePageSummaryTestComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StachePageSummaryTestComponent);
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should transclude the content', () => {
    const text = 'Test summary.';
    fixture.componentInstance.pageSummaryText = text;
    let testElement = fixture.nativeElement;
    fixture.detectChanges();
    expect(testElement.querySelector('.stache-page-summary')).toHaveText(text);
  });
});
