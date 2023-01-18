import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BordersComponent } from './borders.component';
import { BordersModule } from './borders.module';

describe('BordersComponent', () => {
  let component: BordersComponent;
  let fixture: ComponentFixture<BordersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BordersModule],
    });
    fixture = TestBed.createComponent(BordersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
