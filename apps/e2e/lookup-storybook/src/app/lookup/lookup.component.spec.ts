import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupComponent } from './lookup.component';
import { LookupModule } from './lookup.module';

describe('LookupComponent', () => {
  let component: LookupComponent;
  let fixture: ComponentFixture<LookupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LookupModule],
    });
    fixture = TestBed.createComponent(LookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
