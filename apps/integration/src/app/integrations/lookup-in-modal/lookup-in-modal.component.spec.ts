import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { expectAsync } from '@skyux-sdk/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyLookupHarness } from '@skyux/lookup/testing';
import { SkyModalHarness } from '@skyux/modals/testing';
import { SkyThemeService } from '@skyux/theme';

import { LookupInModalComponent } from './lookup-in-modal.component';
import { LookupInModalModule } from './lookup-in-modal.module';

describe('LookupInModalComponent', () => {
  let component: LookupInModalComponent;
  let fixture: ComponentFixture<LookupInModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LookupInModalModule],
      providers: [SkyThemeService, provideRouter([])],
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
        'style',
      ),
    ).toContain('margin-top: 50px');
  });

  it('should show lookup in modal', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const modalHarness = await loader.getHarness(
      SkyModalHarness.with({
        dataSkyId: 'modal-lookup',
      }),
    );
    expect(await modalHarness.getSize()).toBe('small');
    const lookupHarness = await (
      await loader.getHarness(
        SkyInputBoxHarness.with({ dataSkyId: 'favorite-names-field' }),
      )
    ).queryHarness(SkyLookupHarness);
    expect(await (await lookupHarness.getControl()).isFocused()).toBeTrue();
  });

  it('should be accessible', async () => {
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
