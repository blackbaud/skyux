import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheImageComponent } from './image.component';

describe('StacheImageComponent', () => {
  let component: StacheImageComponent;
  let fixture: ComponentFixture<StacheImageComponent>;
  let debugElement: DebugElement;
  let imageSource = 'https://this.is.fake.com/image.png';
  let caption = 'This is a caption';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheImageComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheImageComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should have an imageSource input', () => {
    component.imageSource = imageSource;
    fixture.detectChanges();
    expect(component.imageSource).toBe(imageSource);
  });

  it('should have a caption input', () => {
    component.caption = caption;
    fixture.detectChanges();
    expect(component.caption).toBe(caption);
  });

  it('should leave caption as undefined if it is not passed in by the user', () => {
    fixture.detectChanges();
    expect(component.caption).toBe(undefined);
  });

});
