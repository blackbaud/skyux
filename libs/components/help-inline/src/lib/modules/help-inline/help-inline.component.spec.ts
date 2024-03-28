import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpInlineComponent } from './help-inline.component';

describe('HelpInlineComponent', () => {
  let component: HelpInlineComponent;
  let fixture: ComponentFixture<HelpInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HelpInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
