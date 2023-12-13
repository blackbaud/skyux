import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyFormErrorsComponent } from './form-errors.component';

describe('SkyFormErrorsComponent', () => {
  let fixture: ComponentFixture<SkyFormErrorsComponent>;
  let component: SkyFormErrorsComponent;

  beforeEach(async () => {
    fixture = TestBed.createComponent(SkyFormErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should be toggle announcements', async () => {
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.outerHTML).toContain('aria-live="polite"');
    expect(fixture.nativeElement.outerHTML).toContain('aria-relevant="all"');
    component.announceErrors = false;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.outerHTML).not.toContain('aria-live="polite"');
    expect(fixture.nativeElement.outerHTML).not.toContain(
      'aria-relevant="all"',
    );
    component.announceErrors = true;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.outerHTML).toContain('aria-live="polite"');
    expect(fixture.nativeElement.outerHTML).toContain('aria-relevant="all"');
  });
});
