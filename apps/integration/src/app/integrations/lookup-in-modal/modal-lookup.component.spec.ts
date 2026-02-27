import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { expectAsync } from '@skyux-sdk/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyLookupHarness } from '@skyux/lookup/testing';
import { SkyModalHarness } from '@skyux/modals/testing';
import { SkyThemeService } from '@skyux/theme';

import { LookupInModalModule } from './lookup-in-modal.module';
import { ModalLookupComponent } from './modal-lookup.component';

describe('ModalLookupComponent', () => {
  let fixture: ComponentFixture<ModalLookupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LookupInModalModule],
      providers: [SkyThemeService, provideRouter([])],
    });

    fixture = TestBed.createComponent(ModalLookupComponent);
    fixture.detectChanges();
  });

  it('should show lookup in modal', async () => {
    const consoleLog = spyOn(console, 'log').and.stub();
    await fixture.whenStable();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const modalHarness = await loader.getHarness(
      SkyModalHarness.with({
        dataSkyId: 'modal-lookup',
      }),
    );
    expect(await modalHarness.getSize()).toBe('medium');
    const lookupHarness = await (
      await loader.getHarness(
        SkyInputBoxHarness.with({ dataSkyId: 'favorite-names-field' }),
      )
    ).queryHarness(SkyLookupHarness);
    expect(await (await lookupHarness.getControl()).isDisabled()).toBeFalse();
    fixture.componentInstance.onSubmit();
    expect(consoleLog).toHaveBeenCalledWith({
      submitted: { favoriteNames: [] },
    });
  });

  it('should be accessible', async () => {
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
