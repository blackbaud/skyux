import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { StacheTutorialStepComponent } from './tutorial-step.component';
import { StacheTutorialStepModule } from './tutorial-step.module';

describe('StacheTutorialStepComponent', () => {
  let component: StacheTutorialStepComponent;
  let fixture: ComponentFixture<StacheTutorialStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StacheTutorialStepModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StacheTutorialStepComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should default to showing numbers', () => {
    expect(component.showNumber).toBe(true);
  });

  // This will allow documentation writers to not worry about proper attribute binding.
  it('should allow hiding numbers by setting `showNumber` to string "false"', () => {
    (component as any).showNumber = 'false';
    fixture.detectChanges();
    expect(component.showNumber).toEqual(false);
  });
});
