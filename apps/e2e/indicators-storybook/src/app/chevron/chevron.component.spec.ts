import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChevronComponent } from './chevron.component';
import { ChevronModule } from './chevron.module';

describe('ChevronComponent', () => {
  let component: ChevronComponent;
  let fixture: ComponentFixture<ChevronComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChevronModule],
    });
    fixture = TestBed.createComponent(ChevronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
