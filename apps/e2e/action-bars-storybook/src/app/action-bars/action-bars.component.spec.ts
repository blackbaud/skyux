import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionBarsComponent } from './action-bars.component';
import { ActionBarsModule } from './action-bars.module';

describe('ActionBarsComponent', () => {
  let component: ActionBarsComponent;
  let fixture: ComponentFixture<ActionBarsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ActionBarsModule],
    });
    fixture = TestBed.createComponent(ActionBarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
