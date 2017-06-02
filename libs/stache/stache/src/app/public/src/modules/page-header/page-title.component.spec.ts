import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StachePageTitleComponent } from './page-title.component';

describe('StachePageTitleComponent', () => {
  let component: StachePageTitleComponent;
  let fixture: ComponentFixture<StachePageTitleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StachePageTitleComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StachePageTitleComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});
