import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheColumnComponent } from './column.component';

describe('StacheColumnComponent', () => {
  let component: StacheColumnComponent;
  let fixture: ComponentFixture<StacheColumnComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheColumnComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheColumnComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should add a class to the host element', () => {
    fixture.detectChanges();
    expect(element.className).toContain('stache-column');
  });

  it('should add a class for small, medium, and large breakpoints', () => {
    component.screenSmall = 1;
    component.screenMedium = 2;
    component.screenLarge = 5;
    fixture.detectChanges();
    expect(element.className).toContain('stache-column-sm-1');
    expect(element.className).toContain('stache-column-md-2');
    expect(element.className).toContain('stache-column-lg-5');
  });
});
