import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';
import { SkyKeyInfoHarness } from '@skyux/indicators/testing';

import { IndicatorsKeyInfoHelpKeyExampleComponent } from './example.component';

describe('Basic key info', () => {
  async function setupTest(options?: { value?: number }): Promise<{
    keyInfoHarness: SkyKeyInfoHarness;
    helpInlineHarness: SkyHelpInlineHarness;
    fixture: ComponentFixture<IndicatorsKeyInfoHelpKeyExampleComponent>;
    helpController: SkyHelpTestingController;
  }> {
    const fixture = TestBed.createComponent(
      IndicatorsKeyInfoHelpKeyExampleComponent,
    );

    if (options?.value !== undefined) {
      fixture.componentInstance.value = options.value;
    }

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const keyInfoHarness = await loader.getHarness(
      SkyKeyInfoHarness.with({ dataSkyId: 'key-info-example' }),
    );
    const helpInlineHarness = await loader.getHarness(SkyHelpInlineHarness);
    const helpController = TestBed.inject(SkyHelpTestingController);

    return { keyInfoHarness, helpInlineHarness, fixture, helpController };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IndicatorsKeyInfoHelpKeyExampleComponent, SkyHelpTestingModule],
      providers: [provideNoopAnimations()],
    });
  });

  it('should display a vertical key info', async () => {
    const { keyInfoHarness } = await setupTest({ value: 101 });

    await expectAsync(keyInfoHarness.getLayout()).toBeResolvedTo('vertical');
    await expectAsync(keyInfoHarness.getValueText()).toBeResolvedTo('101');
    await expectAsync(keyInfoHarness.getLabelText()).toBeResolvedTo(
      'New members',
    );
  });

  it('should display a horizontal key info', async () => {
    const { keyInfoHarness } = await setupTest({ value: 50 });

    await expectAsync(keyInfoHarness.getLayout()).toBeResolvedTo('horizontal');
    await expectAsync(keyInfoHarness.getValueText()).toBeResolvedTo('50');
    await expectAsync(keyInfoHarness.getLabelText()).toBeResolvedTo(
      'New members',
    );
  });

  it('should have the correct help key', async () => {
    const { helpInlineHarness, helpController } = await setupTest({
      value: 50,
    });

    await helpInlineHarness.click();

    helpController.expectCurrentHelpKey('new-member-help');
  });
});
