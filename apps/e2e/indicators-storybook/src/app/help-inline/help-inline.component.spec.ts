import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpInlineComponent } from './help-inline.component';
import { HelpInlineModule } from './help-inline.module';

describe('HelpInlineComponent', () => {
  let component: HelpInlineComponent;
  let fixture: ComponentFixture<HelpInlineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HelpInlineModule],
    });
    fixture = TestBed.createComponent(HelpInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
