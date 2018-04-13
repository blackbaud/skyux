import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StachePageAnchorTestComponent } from './demo-anch.component';

describe('StachePageAnchorTestComponent', () => {
  let component: StachePageAnchorTestComponent;
  let fixture: ComponentFixture<StachePageAnchorTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        StachePageAnchorTestComponent
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StachePageAnchorTestComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should change the value of changeable after 2 seconds from init', () => {
    spyOn(window, 'setTimeout').and.callFake((cb: any) => {
      cb();
    });
    expect(component.changeable).toBe('Value One');
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.changeable).toBe('different value');
  });
});
