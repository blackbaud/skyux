import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeaterComponent } from './repeater.component';
import { RepeaterModule } from './repeater.module';

describe('RepeaterComponent', () => {
  let component: RepeaterComponent;
  let fixture: ComponentFixture<RepeaterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RepeaterModule],
    });
    fixture = TestBed.createComponent(RepeaterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
