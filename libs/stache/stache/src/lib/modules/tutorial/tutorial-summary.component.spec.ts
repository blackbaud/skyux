import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { StacheTutorialSummaryComponent } from './tutorial-summary.component';
import { StacheTutorialModule } from './tutorial.module';

describe('StacheTutorialSummaryComponent', () => {
  let fixture: ComponentFixture<StacheTutorialSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StacheTutorialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StacheTutorialSummaryComponent);
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});
