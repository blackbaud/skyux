import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyHelpService, SkyIdService } from '@skyux/core';
import { SkyHelpTestingModule } from '@skyux/core/testing';

import { ToggleSwitchHarnessTestComponent } from './fixtures/toggle-switch-harness-test.component';
import { SkyToggleSwitchHarness } from './toggle-switch-harness';

let index: number;

async function setupTest(
  options: { dataSkyId?: string; useAlternateLabel?: boolean } = {},
): Promise<{
  toggleSwitchHarness: SkyToggleSwitchHarness;
  fixture: ComponentFixture<ToggleSwitchHarnessTestComponent>;
  loader: HarnessLoader;
}> {
  index = 0;
  await TestBed.configureTestingModule({
    imports: [
      ToggleSwitchHarnessTestComponent,
      SkyHelpTestingModule,
      NoopAnimationsModule,
    ],
  }).compileComponents();

  spyOn(TestBed.inject(SkyIdService), 'generateId').and.callFake(
    () => `MOCK_ID_${++index}`,
  );

  const fixture = TestBed.createComponent(ToggleSwitchHarnessTestComponent);
  if (options.useAlternateLabel) {
    fixture.componentRef.setInput('useAlternateLabel', 'true');
    fixture.detectChanges();
  }
  const loader = TestbedHarnessEnvironment.loader(fixture);

  const toggleSwitchHarness: SkyToggleSwitchHarness = options.dataSkyId
    ? await loader.getHarness(
        SkyToggleSwitchHarness.with({
          dataSkyId: options.dataSkyId,
        }),
      )
    : await loader.getHarness(SkyToggleSwitchHarness);

  return { toggleSwitchHarness, fixture, loader };
}

describe('Toggle switch harness', () => {
  it('should check and uncheck the toggle switch', async () => {
    const { toggleSwitchHarness } = await setupTest({
      dataSkyId: 'toggle-switch',
    });

    await expectAsync(toggleSwitchHarness.isChecked()).toBeResolvedTo(false);

    await toggleSwitchHarness.check();
    await expectAsync(toggleSwitchHarness.isChecked()).toBeResolvedTo(true);

    await toggleSwitchHarness.uncheck();
    await expectAsync(toggleSwitchHarness.isChecked()).toBeResolvedTo(false);
  });

  it('should check if toggle switch is disabled', async () => {
    const { toggleSwitchHarness, fixture } = await setupTest({
      dataSkyId: 'toggle-switch',
    });

    await expectAsync(toggleSwitchHarness.isDisabled()).toBeResolvedTo(false);

    fixture.componentInstance.disableForm();
    await expectAsync(toggleSwitchHarness.isDisabled()).toBeResolvedTo(true);
  });

  it('should focus the toggle switch', async () => {
    const { toggleSwitchHarness } = await setupTest({
      dataSkyId: 'toggle-switch',
    });

    await expectAsync(toggleSwitchHarness.isFocused()).toBeResolvedTo(false);

    await toggleSwitchHarness.focus();
    await expectAsync(toggleSwitchHarness.isFocused()).toBeResolvedTo(true);

    await toggleSwitchHarness.blur();
    await expectAsync(toggleSwitchHarness.isFocused()).toBeResolvedTo(false);
  });

  it('should handle a missing label when getting the label text', async () => {
    const { toggleSwitchHarness, fixture } = await setupTest({
      dataSkyId: 'toggle-switch',
    });

    fixture.componentRef.setInput('labelText', undefined);
    fixture.detectChanges();

    await expectAsync(toggleSwitchHarness.getLabelText()).toBeResolvedTo(
      undefined,
    );
  });

  it('should get the label text when specified via `labelText` input', async () => {
    const { toggleSwitchHarness } = await setupTest({
      dataSkyId: 'toggle-switch',
    });

    await expectAsync(toggleSwitchHarness.getLabelText()).toBeResolvedTo(
      'Label text',
    );
  });

  it('should get the label text when using the label element', async () => {
    const { toggleSwitchHarness } = await setupTest({
      dataSkyId: 'toggle-switch',
      useAlternateLabel: true,
    });

    await expectAsync(toggleSwitchHarness.getLabelText()).toBeResolvedTo(
      'Alternate label',
    );
  });

  it('should get the label text when specified via `labelText` input and label is hidden', async () => {
    const { toggleSwitchHarness, fixture } = await setupTest({
      dataSkyId: 'toggle-switch',
    });

    fixture.componentRef.setInput('labelHidden', 'true');
    fixture.detectChanges();

    await expectAsync(toggleSwitchHarness.getLabelText()).toBeResolvedTo(
      'Label text',
    );
  });

  it('should indicate the label is not hidden when the label is specified via `labelText`', async () => {
    const { toggleSwitchHarness } = await setupTest({
      dataSkyId: 'toggle-switch',
    });

    await expectAsync(toggleSwitchHarness.getLabelHidden()).toBeResolvedTo(
      false,
    );
  });

  it('should indicate the label is hidden when the label is specified via `labelText`', async () => {
    const { toggleSwitchHarness, fixture } = await setupTest({
      dataSkyId: 'toggle-switch',
    });

    fixture.componentRef.setInput('labelHidden', 'true');
    fixture.detectChanges();

    await expectAsync(toggleSwitchHarness.getLabelHidden()).toBeResolvedTo(
      true,
    );
  });

  it('should throw an error when getting `labelHidden` for a toggle switch using `sky-toggle-switch-label`', async () => {
    const { toggleSwitchHarness } = await setupTest({
      dataSkyId: 'toggle-switch',
      useAlternateLabel: true,
    });

    await expectAsync(
      toggleSwitchHarness.getLabelHidden(),
    ).toBeRejectedWithError(
      '`labelHidden` is only supported when setting the toggle switch label via the `labelText` input.',
    );
  });

  it('should throw error if toggling a disabled toggle switch', async () => {
    const { toggleSwitchHarness, fixture } = await setupTest({
      dataSkyId: 'toggle-switch',
    });

    fixture.componentInstance.disableForm();

    await expectAsync(toggleSwitchHarness.isChecked()).toBeResolvedTo(false);

    await expectAsync(toggleSwitchHarness.check()).toBeRejectedWithError(
      'Could not toggle the toggle switch because it is disabled.',
    );
  });

  it('should throw an error if no help inline is found', async () => {
    const { toggleSwitchHarness, fixture } = await setupTest({
      dataSkyId: 'toggle-switch',
    });

    fixture.componentRef.setInput('helpPopoverContent', undefined);

    await expectAsync(
      toggleSwitchHarness.clickHelpInline(),
    ).toBeRejectedWithError('No help inline found.');
  });

  it('should open help inline popover when clicked', async () => {
    const { toggleSwitchHarness, fixture } = await setupTest({
      dataSkyId: 'toggle-switch',
    });

    await toggleSwitchHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should open help widget when clicked', async () => {
    const { toggleSwitchHarness, fixture } = await setupTest({
      dataSkyId: 'toggle-switch',
    });
    const helpSvc = TestBed.inject(SkyHelpService);
    const helpSpy = spyOn(helpSvc, 'openHelp');
    fixture.componentRef.setInput('helpKey', 'helpKey.html');
    fixture.componentRef.setInput('helpPopoverContent', undefined);
    fixture.detectChanges();

    await toggleSwitchHarness.clickHelpInline();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(helpSpy).toHaveBeenCalledWith({ helpKey: 'helpKey.html' });
  });
});
