import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';

import { KeyInfoHarnessTestComponent } from './fixtures/key-info-harness-test.component';
import { KeyInfoHarnessTestModule } from './fixtures/key-info-harness-test.module';
import { SkyKeyInfoHarness } from './key-info-harness';

describe('Key Info harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}) {
    const fixture = TestBed.createComponent(KeyInfoHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const keyInfoHarness = await loader.getHarness(
      SkyKeyInfoHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { fixture, keyInfoHarness };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KeyInfoHarnessTestModule],
    });
  });

  it('should return properties for a horizontal layout', async () => {
    const { keyInfoHarness } = await setupTest({
      dataSkyId: 'horizontal-key-info',
    });

    await expectAsync(keyInfoHarness.getLayout()).toBeResolvedTo('horizontal');
    await expectAsync(keyInfoHarness.getValueText()).toBeResolvedTo('200');
    await expectAsync(keyInfoHarness.getLabelText()).toBeResolvedTo(
      'Horizontal label',
    );
  });

  it('should return properties for a vertical layout', async () => {
    const { keyInfoHarness } = await setupTest({
      dataSkyId: 'vertical-key-info',
    });

    await expectAsync(keyInfoHarness.getLayout()).toBeResolvedTo('vertical');
    await expectAsync(keyInfoHarness.getValueText()).toBeResolvedTo('100');
    await expectAsync(keyInfoHarness.getLabelText()).toBeResolvedTo(
      'Vertical label',
    );
  });
});
