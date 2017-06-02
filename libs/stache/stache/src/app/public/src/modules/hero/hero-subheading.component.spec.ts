import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheHeroSubheadingComponent } from './hero-subheading.component';

describe('StacheHeroSubheadingComponent', () => {
  let component: StacheHeroSubheadingComponent;
  let fixture: ComponentFixture<StacheHeroSubheadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheHeroSubheadingComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheHeroSubheadingComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});
