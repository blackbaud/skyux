import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TileDashboardComponent } from './tile-dashboard.component';
import { TileDashboardModule } from './tile-dashboard.module';

describe('TileDashboardComponent', () => {
  let component: TileDashboardComponent;
  let fixture: ComponentFixture<TileDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TileDashboardModule],
    });
    fixture = TestBed.createComponent(TileDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
