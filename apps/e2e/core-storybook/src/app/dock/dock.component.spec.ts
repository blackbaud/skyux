import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DockComponent } from './dock.component';
import { DockModule } from './dock.module';

describe('DockComponent', () => {
  let component: DockComponent;
  let fixture: ComponentFixture<DockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DockModule],
    });
    fixture = TestBed.createComponent(DockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
