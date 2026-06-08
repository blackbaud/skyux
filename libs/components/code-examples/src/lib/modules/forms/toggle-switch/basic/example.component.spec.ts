import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyToggleSwitchHarness } from '@skyux/forms/testing';

import { FormsToggleSwitchBasicExampleComponent } from './example.component';

describe('Basic toggle switch example', () => {
  async function setupTest(options: {
    dataSkyId: string;
  }): Promise<SkyToggleSwitchHarness> {
    const fixture = TestBed.createComponent(
      FormsToggleSwitchBasicExampleComponent,
    );

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const toggleSwitchHarness = await loader.getHarness(
      SkyToggleSwitchHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return toggleSwitchHarness;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsToggleSwitchBasicExampleComponent],
    });
  });

  it('should set up the component', async () => {
    const toggleSwitchHarness = await setupTest({ dataSkyId: 'toggle-switch' });

    await expectAsync(toggleSwitchHarness.getLabelText()).toBeResolvedTo(
      'Open for registration',
    );

    await expectAsync(toggleSwitchHarness.isChecked()).toBeResolvedTo(false);
    await toggleSwitchHarness.check();
    await expectAsync(toggleSwitchHarness.isChecked()).toBeResolvedTo(true);
    await toggleSwitchHarness.uncheck();
    await toggleSwitchHarness.blur();
    await expectAsync(toggleSwitchHarness.isChecked()).toBeResolvedTo(false);
  });

  it('should show a help popover with the expected text', async () => {
    const toggleSwitchHarness = await setupTest({
      dataSkyId: 'toggle-switch',
    });

    await toggleSwitchHarness.clickHelpInline();

    const helpPopoverContent =
      await toggleSwitchHarness.getHelpPopoverContent();
    expect(helpPopoverContent).toBe(
      `When you open an event, a registration page becomes available online, and admins are able to register people to attend.`,
    );
  });
});
