import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SkyGridComponent } from './grid.component';

describe('SkyGridComponent', () => {
  let component: SkyGridComponent<Record<string, unknown>>;
  let fixture: ComponentFixture<SkyGridComponent<Record<string, unknown>>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyGridComponent, RouterTestingModule.withRoutes([])],
    });
    fixture = TestBed.createComponent(SkyGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
