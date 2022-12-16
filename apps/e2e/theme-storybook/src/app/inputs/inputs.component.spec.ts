import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsComponent } from './inputs.component';
import { InputsModule } from './inputs.module';

describe('InputsComponent', () => {
  let component: InputsComponent;
  let fixture: ComponentFixture<InputsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InputsModule],
    });
    fixture = TestBed.createComponent(InputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
