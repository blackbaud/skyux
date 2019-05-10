import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  StacheHideFromSearchComponent
} from './hide-from-search.component';

import {
  StacheHideFromSearchModule
} from './hide-from-search.module';

describe('StacheHideFromSearchComponent', () => {
  let fixture: ComponentFixture<StacheHideFromSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StacheHideFromSearchModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheHideFromSearchComponent);
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});
