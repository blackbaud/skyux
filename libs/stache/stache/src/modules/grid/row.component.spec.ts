import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheRowComponent } from './row.component';

describe('StacheRowComponent', () => {
  let component: StacheRowComponent;
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
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should create an element with a specific classname', () => {
    fixture.detectChanges();
    expect(element.querySelector('.stache-row')).toExist();
  });

  it('should add a classname to reverse the column order', () => {
    component.reverseColumnOrder = true;
    fixture.detectChanges();
    expect(element.querySelector('.stache-row-reverse')).toExist();
  });
});
