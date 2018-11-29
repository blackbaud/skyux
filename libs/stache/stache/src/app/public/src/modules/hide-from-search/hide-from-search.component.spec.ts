import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';
import { StacheHideFromSearchComponent } from './hide-from-search.component';

describe('StacheHideFromSearchComponent', () => {
  let fixture: ComponentFixture<StacheHideFromSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheHideFromSearchComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheHideFromSearchComponent);
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});
