import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyKeyInfoHarness } from '@skyux/indicators/testing';

import { KeyInfoDemoComponent } from './key-info-demo.component';
import { KeyInfoDemoModule } from './key-info-demo.module';

describe('Basic key info', () => {
  async function setupTest(options?: { layout?: 'vertical' | 'horizontal' }) {
    const fixture = TestBed.createComponent(KeyInfoDemoComponent);

    if (options?.layout !== undefined) {
      fixture.componentInstance.layout = options.layout;
    }

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const keyInfoHarness = await loader.getHarness(
      SkyKeyInfoHarness.with({ dataSkyId: 'key-info-demo' })
    );

    return { keyInfoHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KeyInfoDemoModule],
    });
  });

  it('should display a vertical key info', async () => {
    const { keyInfoHarness, fixture } = await setupTest({ layout: 'vertical' });
    fixture.detectChanges();

    await expectAsync(keyInfoHarness.getLayout()).toBeResolvedTo('vertical');
    await expectAsync(keyInfoHarness.getValueText()).toBeResolvedTo('575');
    await expectAsync(keyInfoHarness.getLabelText()).toBeResolvedTo(
      'New members'
    );
  });

  it('should display a horizontal key info', async () => {
    const { keyInfoHarness, fixture } = await setupTest({
      layout: 'horizontal',
    });
    fixture.detectChanges();

    await expectAsync(keyInfoHarness.getLayout()).toBeResolvedTo('horizontal');
    await expectAsync(keyInfoHarness.getValueText()).toBeResolvedTo('575');
    await expectAsync(keyInfoHarness.getLabelText()).toBeResolvedTo(
      'New members'
    );
  });
});
