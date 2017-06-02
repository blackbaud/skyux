import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheTutorialSummaryComponent } from './tutorial-summary.component';

describe('StacheTutorialSummaryComponent', () => {
  let component: StacheTutorialSummaryComponent;
  let fixture: ComponentFixture<StacheTutorialSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheTutorialSummaryComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheTutorialSummaryComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});
