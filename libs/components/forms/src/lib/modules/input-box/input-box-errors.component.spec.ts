import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputBoxErrorsComponent } from './input-box-errors.component';

describe('InputBoxErrorsComponent', () => {
  let component: InputBoxErrorsComponent;
  let fixture: ComponentFixture<InputBoxErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputBoxErrorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputBoxErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
