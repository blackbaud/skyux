import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldHeightsComponent } from './field-heights.component';

describe('FieldHeightsComponent', () => {
  let component: FieldHeightsComponent;
  let fixture: ComponentFixture<FieldHeightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FieldHeightsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldHeightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
