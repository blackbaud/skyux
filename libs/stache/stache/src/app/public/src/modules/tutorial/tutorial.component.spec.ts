import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheTutorialComponent } from './tutorial.component';

describe('StacheTutorialComponent', () => {
  let component: StacheTutorialComponent;
  let fixture: ComponentFixture<StacheTutorialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheTutorialComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheTutorialComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});
