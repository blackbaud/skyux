import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionButtonComponent } from './action-button.component';
import { ActionButtonModule } from './action-button.module';

describe('ActionButtonComponent', () => {
  let component: ActionButtonComponent;
  let fixture: ComponentFixture<ActionButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ActionButtonModule],
    });
    fixture = TestBed.createComponent(ActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
