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

  it('should toggle announcements', async () => {
    expect(component).toBeTruthy();

    // Initially the component should announce errors.
    expect(fixture.nativeElement.outerHTML).toContain('aria-relevant="all"');
    expect(fixture.nativeElement.outerHTML).toContain('role="alert"');

    // When announceErrors is false, the component should not announce errors.
    component.announceErrors = false;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.outerHTML).not.toContain(
      'aria-relevant="all"',
    );
    expect(fixture.nativeElement.outerHTML).not.toContain('role="alert"');

    // When announceErrors is true, the component should announce errors.
    component.announceErrors = true;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.outerHTML).toContain('aria-relevant="all"');
    expect(fixture.nativeElement.outerHTML).toContain('role="alert"');
  });
});
