import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationComponent } from './validation.component';
import { ValidationModule } from './validation.module';

describe('ValidationComponent', () => {
  let component: ValidationComponent;
  let fixture: ComponentFixture<ValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ValidationModule],
    });
    fixture = TestBed.createComponent(ValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
