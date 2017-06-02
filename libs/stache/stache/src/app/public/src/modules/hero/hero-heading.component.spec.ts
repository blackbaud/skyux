import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheHeroHeadingComponent } from './hero-heading.component';

describe('StacheHeroHeadingComponent', () => {
  let component: StacheHeroHeadingComponent;
  let fixture: ComponentFixture<StacheHeroHeadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheHeroHeadingComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheHeroHeadingComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});
