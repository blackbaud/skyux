import { ComponentFixture, fakeAsync, tick, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';
import { TestUtility } from '../testing/testutility';

import { StacheBackToTopComponent } from './back-to-top.component';

describe('StacheBackToTopComponent', () => {
  let component: StacheBackToTopComponent;
  let fixture: ComponentFixture<StacheBackToTopComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ StacheBackToTopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheBackToTopComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should have a default offset value of 200', () => {
    fixture.detectChanges();

    const expectedOffsetValue = component.offset;
    expect(expectedOffsetValue).toBe(200);
  });

  it('should have the set offset value', () => {
    component.offset = 400;

    fixture.detectChanges();

    const expectedOffsetValue = component.offset;
    expect(expectedOffsetValue).toBe(400);
  });

  it('should be hidden when the window y offset is less than the specified offset', () => {
    fixture.detectChanges();

    expect(component.isHidden).toBe(true);
  });

  it('should show when the window y offset is greater than the specified offset', fakeAsync(() => {
    component.offset = 0;
    TestUtility.fireDomEvent(window, 'scroll');
    tick();

    expect(component.isHidden).toBe(false);
  }));

  it('should fire a click event on button click', () => {
    spyOn(component, 'scrollToTop');
    let button = debugElement.nativeElement.querySelector('.stache-back-to-top');
    button.click();

    fixture.whenStable().then(() => {
      expect(component.scrollToTop).toHaveBeenCalled();
    });
  });

});
