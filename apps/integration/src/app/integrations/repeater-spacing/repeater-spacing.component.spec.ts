import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expectAsync } from '@skyux-sdk/testing';

import RepeaterSpacingComponent from './repeater-spacing.component';

describe('RepeaterSpacingComponent', () => {
  let component: RepeaterSpacingComponent;
  let fixture: ComponentFixture<RepeaterSpacingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RepeaterSpacingComponent],
    });

    fixture = TestBed.createComponent(RepeaterSpacingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be accessible', async () => {
    // Each repeater's aria role settles a couple of change-detection cycles
    // after its content is registered; see SkyRepeaterComponent#updateRole.
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
