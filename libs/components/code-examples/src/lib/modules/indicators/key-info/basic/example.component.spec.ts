import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';
import { SkyKeyInfoHarness } from '@skyux/indicators/testing';

import { IndicatorsKeyInfoBasicExampleComponent } from './example.component';

describe('Basic key info', () => {
  async function setupTest(options?: { value?: number }): Promise<{
    keyInfoHarness: SkyKeyInfoHarness;
    helpInlineHarness: SkyHelpInlineHarness;
    fixture: ComponentFixture<IndicatorsKeyInfoBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      IndicatorsKeyInfoBasicExampleComponent,
    );

    if (options?.value !== undefined) {
      fixture.componentInstance.value = options.value;
    }

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const keyInfoHarness = await loader.getHarness(
      SkyKeyInfoHarness.with({ dataSkyId: 'key-info-example' }),
    );
    const helpInlineHarness = await loader.getHarness(SkyHelpInlineHarness);

    return { keyInfoHarness, helpInlineHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IndicatorsKeyInfoBasicExampleComponent],
      providers: [],
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

  it('should include inline help', async () => {
    const { helpInlineHarness } = await setupTest({ value: 50 });

    await expectAsync(helpInlineHarness.getAriaExpanded()).toBeResolvedTo(
      false,
    );
    await helpInlineHarness.click();
    await expectAsync(helpInlineHarness.getAriaExpanded()).toBeResolvedTo(true);
    expect(await helpInlineHarness.getPopoverContent()).toContain(
      'help content can add clarity',
    );
  });
});
