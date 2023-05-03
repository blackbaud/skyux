import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputBoxComponent } from './input-box.component';
import { InputBoxModule } from './input-box.module';

describe('InputBoxComponent', () => {
  let component: InputBoxComponent;
  let fixture: ComponentFixture<InputBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InputBoxModule],
    });
    fixture = TestBed.createComponent(InputBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
