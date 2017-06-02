import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheTutorialStepComponent } from './tutorial-step.component';

describe('StacheTutorialStepComponent', () => {
  let component: StacheTutorialStepComponent;
  let fixture: ComponentFixture<StacheTutorialStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheTutorialStepComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheTutorialStepComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should default to showing numbers', () => {
    expect(component.showNumber).toBe(true);
  });
});
