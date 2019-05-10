import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  StacheIncludeComponent
} from './include.component';

import {
  StacheIncludeModule
} from './include.module';

describe('StacheIncludeComponent', () => {
  let fixture: ComponentFixture<StacheIncludeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StacheIncludeModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheIncludeComponent);
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});
