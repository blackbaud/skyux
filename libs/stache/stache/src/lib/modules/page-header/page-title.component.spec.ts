import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { StachePageTitleComponent } from './page-title.component';

describe('StachePageTitleComponent', () => {
  let fixture: ComponentFixture<StachePageTitleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StachePageTitleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StachePageTitleComponent);
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});
