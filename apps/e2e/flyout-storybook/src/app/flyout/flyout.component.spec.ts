import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlyoutComponent } from './flyout.component';
import { FlyoutModule } from './flyout.module';

describe('FlyoutComponent', () => {
  let component: FlyoutComponent;
  let fixture: ComponentFixture<FlyoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FlyoutModule],
    });
    fixture = TestBed.createComponent(FlyoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
