import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchControlsComponent } from './switch-controls.component';
import { SwitchControlsModule } from './switch-controls.module';

describe('SwitchControlsComponent', () => {
  let component: SwitchControlsComponent;
  let fixture: ComponentFixture<SwitchControlsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SwitchControlsModule],
    });
    fixture = TestBed.createComponent(SwitchControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
