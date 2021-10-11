import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  NO_ERRORS_SCHEMA
} from '@angular/core';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  expect
} from '@skyux-sdk/testing';

import {
  StacheTutorialStepHeadingComponent
} from './tutorial-step-heading.component';

import {
  StacheTutorialStepModule
} from './tutorial-step.module';

describe('StacheTutorialStepHeadingComponent', () => {
  let fixture: ComponentFixture<StacheTutorialStepHeadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StacheTutorialStepModule
      ],
      providers: [
        SkyAppConfig
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheTutorialStepHeadingComponent);
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});
