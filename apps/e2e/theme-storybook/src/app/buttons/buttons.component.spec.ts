import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonsComponent } from './buttons.component';
import { ButtonsModule } from './buttons.module';

describe('ButtonsComponent', () => {
  let component: ButtonsComponent;
  let fixture: ComponentFixture<ButtonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ButtonsModule],
    });
    fixture = TestBed.createComponent(ButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
