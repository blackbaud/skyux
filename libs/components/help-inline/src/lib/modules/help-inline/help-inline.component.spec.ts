import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyHelpInlineComponent } from './help-inline.component';

describe('SkyHelpInlineComponent', () => {
  let component: SkyHelpInlineComponent;
  let fixture: ComponentFixture<SkyHelpInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkyHelpInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkyHelpInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
