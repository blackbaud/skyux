import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitComponent } from './wait.component';
import { WaitModule } from './wait.module';

describe('WaitComponent', () => {
  let component: WaitComponent;
  let fixture: ComponentFixture<WaitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WaitModule],
    });
    fixture = TestBed.createComponent(WaitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
