import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneFieldComponent } from './phone-field.component';
import { PhoneFieldModule } from './phone-field.module';

describe('PhoneFieldComponent', () => {
  let component: PhoneFieldComponent;
  let fixture: ComponentFixture<PhoneFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PhoneFieldModule],
    });
    fixture = TestBed.createComponent(PhoneFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
