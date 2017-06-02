import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheTutorialHeadingComponent } from './tutorial-heading.component';

describe('StacheTutorialHeadingComponent', () => {
  let component: StacheTutorialHeadingComponent;
  let fixture: ComponentFixture<StacheTutorialHeadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheTutorialHeadingComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheTutorialHeadingComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});
