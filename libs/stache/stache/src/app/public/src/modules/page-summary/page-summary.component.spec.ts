import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StachePageSummaryComponent } from './page-summary.component';
import { StachePageSummaryTestComponent } from './fixtures/page-summary.component.fixture';

describe('StachePageSummaryComponent', () => {
  let component: StachePageSummaryComponent;
  let fixture: ComponentFixture<StachePageSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StachePageSummaryComponent,
        StachePageSummaryTestComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StachePageSummaryComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should transclude the content', () => {
    const text = 'Test summary.';
    let testFixture = TestBed.createComponent(StachePageSummaryTestComponent);
    let testElement = testFixture.nativeElement;
    testFixture.detectChanges();
    expect(testElement.querySelector('.stache-page-summary')).toHaveText(text);
  });
});
