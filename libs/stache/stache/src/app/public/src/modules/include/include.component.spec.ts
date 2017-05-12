import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheIncludeComponent } from './include.component';

describe('StacheIncludeComponent', () => {
  let component: StacheIncludeComponent;
  let fixture: ComponentFixture<StacheIncludeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheIncludeComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheIncludeComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});
