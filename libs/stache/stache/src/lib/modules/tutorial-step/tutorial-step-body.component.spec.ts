import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { StacheTutorialStepBodyComponent } from './tutorial-step-body.component';
import { StacheTutorialStepModule } from './tutorial-step.module';

describe('StacheTutorialStepBodyComponent', () => {
  let fixture: ComponentFixture<StacheTutorialStepBodyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StacheTutorialStepModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StacheTutorialStepBodyComponent);
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});
