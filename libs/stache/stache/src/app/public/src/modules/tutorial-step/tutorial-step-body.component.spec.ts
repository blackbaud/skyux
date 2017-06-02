import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheTutorialStepBodyComponent } from './tutorial-step-body.component';

describe('StacheTutorialStepBodyComponent', () => {
  let component: StacheTutorialStepBodyComponent;
  let fixture: ComponentFixture<StacheTutorialStepBodyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheTutorialStepBodyComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheTutorialStepBodyComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});
