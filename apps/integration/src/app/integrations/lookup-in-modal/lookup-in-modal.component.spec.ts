import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expectAsync } from '@skyux-sdk/testing';
import { SkyThemeService } from '@skyux/theme';

import { LookupInModalComponent } from './lookup-in-modal.component';
import { LookupInModalModule } from './lookup-in-modal.module';

describe('LookupInModalComponent', () => {
  let component: LookupInModalComponent;
  let fixture: ComponentFixture<LookupInModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LookupInModalModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [SkyThemeService],
    });

    fixture = TestBed.createComponent(LookupInModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should add margin', async () => {
    expect(component).toBeTruthy();
    await fixture.whenStable();
    expect(
      (fixture.nativeElement as HTMLElement).ownerDocument.body.getAttribute(
        'style'
      )
    ).toContain('margin-top: 50px');
  });

  it('should be accessible', async () => {
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
