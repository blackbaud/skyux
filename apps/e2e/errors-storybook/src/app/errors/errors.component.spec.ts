import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorsComponent } from './errors.component';
import { ErrorsModule } from './errors.module';

describe('ErrorsComponent', () => {
  let component: ErrorsComponent;
  let fixture: ComponentFixture<ErrorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ErrorsModule],
    });
    fixture = TestBed.createComponent(ErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
