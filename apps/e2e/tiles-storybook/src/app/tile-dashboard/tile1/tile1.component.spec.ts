import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tile1Component } from './tile1.component';

describe('Tile1Component', () => {
  let component: Tile1Component;
  let fixture: ComponentFixture<Tile1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Tile1Component],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tile1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
