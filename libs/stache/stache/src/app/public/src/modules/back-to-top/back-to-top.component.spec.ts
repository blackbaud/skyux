import { async, ComponentFixture, fakeAsync, inject, tick, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheWindowRef, TestUtility } from '../shared';
import { StacheBackToTopComponent } from './back-to-top.component';

describe('StacheBackToTopComponent', () => {
  let component: StacheBackToTopComponent;
  let fixture: ComponentFixture<StacheBackToTopComponent>;
  let debugElement: DebugElement;
  let windowRef: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheBackToTopComponent
      ],
      providers: [
        StacheWindowRef
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheBackToTopComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  beforeEach(inject([StacheWindowRef], (service: any) => {
    windowRef = service.nativeWindow;
  }));

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
    TestUtility.triggerDomEvent(windowRef, 'scroll');
    tick();
    expect(component.isHidden).toBe(false);
  }));

  it('should trigger a click event on button click', async(() => {
    spyOn(component, 'scrollToTop');
    let button = debugElement.nativeElement.querySelector('.stache-back-to-top');
    button.click();
    fixture.whenStable()
      .then(() => {
        expect(component.scrollToTop).toHaveBeenCalled();
      });
  }));

  it('should call the scroll method on the window when clicked', async(() => {
    spyOn(windowRef, 'scroll');
    let button = debugElement.nativeElement.querySelector('.stache-back-to-top');
    button.click();
    fixture.whenStable()
      .then(() => {
        expect(windowRef.scroll).toHaveBeenCalled();
      });
  }));
});
