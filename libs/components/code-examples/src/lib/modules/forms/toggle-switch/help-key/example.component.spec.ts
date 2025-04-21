import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';
import { SkyToggleSwitchHarness } from '@skyux/forms/testing';

import { FormsToggleSwitchHelpKeyExampleComponent } from './example.component';

describe('Basic toggle switch example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    toggleSwitchHarness: SkyToggleSwitchHarness;
    helpController: SkyHelpTestingController;
  }> {
    const fixture = TestBed.createComponent(
      FormsToggleSwitchHelpKeyExampleComponent,
    );

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const toggleSwitchHarness = await loader.getHarness(
      SkyToggleSwitchHarness.with({ dataSkyId: options.dataSkyId }),
    );

    const helpController = TestBed.inject(SkyHelpTestingController);

    fixture.detectChanges();
    await fixture.whenStable();

    return { toggleSwitchHarness, helpController };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FormsToggleSwitchHelpKeyExampleComponent,
        SkyHelpTestingModule,
      ],
    });
  });

  it('should set up the component', async () => {
    const { toggleSwitchHarness } = await setupTest({
      dataSkyId: 'toggle-switch',
    });

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

  it('should have the correct help key for toggle switch', async () => {
    const { toggleSwitchHarness, helpController } = await setupTest({
      dataSkyId: 'toggle-switch',
    });

    await toggleSwitchHarness.clickHelpInline();

    helpController.expectCurrentHelpKey('registration-help');
  });
});
