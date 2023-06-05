import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpansionIndicatorComponent } from './expansion-indicator.component';
import { ExpansionIndicatorModule } from './expansion-indicator.module';

describe('ExpansionIndicatorComponent', () => {
  let component: ExpansionIndicatorComponent;
  let fixture: ComponentFixture<ExpansionIndicatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ExpansionIndicatorModule],
    });
    fixture = TestBed.createComponent(ExpansionIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
