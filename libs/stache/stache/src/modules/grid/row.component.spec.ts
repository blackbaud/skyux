import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheRowComponent } from './row.component';

describe('StacheRowComponent', () => {
  let fixture: ComponentFixture<StacheRowComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheRowComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheRowComponent);
    element = fixture.nativeElement;
  });

  it('should create an element with a class', () => {
    fixture.detectChanges();
    expect(element.querySelector('.stache-row')).toExist();
  });
});
