import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheTutorialStepHeadingComponent } from './tutorial-step-heading.component';

describe('StacheTutorialStepHeadingComponent', () => {
  let component: StacheTutorialStepHeadingComponent;
  let fixture: ComponentFixture<StacheTutorialStepHeadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheTutorialStepHeadingComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheTutorialStepHeadingComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});
