import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheContainerComponent } from './container.component';

describe('StacheContainerComponent', () => {
  let component: StacheContainerComponent;
  let fixture: ComponentFixture<StacheContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheContainerComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheContainerComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});
