import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackToTopComponent } from './back-to-top.component';
import { BackToTopModule } from './back-to-top.module';

describe('BackToTopComponent', () => {
  let component: BackToTopComponent;
  let fixture: ComponentFixture<BackToTopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BackToTopModule],
    });
    fixture = TestBed.createComponent(BackToTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
