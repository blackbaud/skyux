import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyHelpInlinePopoverComponent } from './help-inline-popover.component';

describe('SkyHelpInlinePopoverComponent', () => {
  let component: SkyHelpInlinePopoverComponent;
  let fixture: ComponentFixture<SkyHelpInlinePopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkyHelpInlinePopoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkyHelpInlinePopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
