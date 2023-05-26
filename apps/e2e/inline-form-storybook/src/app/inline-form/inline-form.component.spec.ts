import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineFormComponent } from './inline-form.component';
import { InlineFormModule } from './inline-form.module';

describe('InlineFormComponent', () => {
  let component: InlineFormComponent;
  let fixture: ComponentFixture<InlineFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InlineFormModule],
    });
    fixture = TestBed.createComponent(InlineFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
