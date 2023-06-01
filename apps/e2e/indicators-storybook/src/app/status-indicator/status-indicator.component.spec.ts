import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusIndicatorComponent } from './status-indicator.component';
import { StatusIndicatorModule } from './status-indicator.module';

describe('StatusIndicatorComponent', () => {
  let component: StatusIndicatorComponent;
  let fixture: ComponentFixture<StatusIndicatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StatusIndicatorModule],
    });
    fixture = TestBed.createComponent(StatusIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
