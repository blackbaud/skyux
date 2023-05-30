import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidGridComponent } from './fluid-grid.component';
import { FluidGridModule } from './fluid-grid.module';

describe('FluidGridComponent', () => {
  let component: FluidGridComponent;
  let fixture: ComponentFixture<FluidGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FluidGridModule],
    });
    fixture = TestBed.createComponent(FluidGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
