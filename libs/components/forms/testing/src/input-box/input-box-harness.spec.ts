import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';

import { InputBoxHarnessTestComponent } from './fixtures/input-box-harness-test.component';
import { InputBoxHarnessTestModule } from './fixtures/input-box-harness-test.module';
import { LastNameHarness } from './fixtures/last-name-harness';
import { SkyInputBoxHarness } from './input-box-harness';

describe('Input box harness', () => {
  async function setupTest(options: { dataSkyId: string }) {
    await TestBed.configureTestingModule({
      imports: [InputBoxHarnessTestModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(InputBoxHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const inputBoxHarness = await loader.getHarness(
      SkyInputBoxHarness.with({
        dataSkyId: options.dataSkyId,
      })
    );

    return { inputBoxHarness };
  }

  it('should query child elements', async () => {
    const { inputBoxHarness } = await setupTest({
      dataSkyId: 'my_input_box_first_name',
    });

    const input = await inputBoxHarness.querySelector('.sky-form-control');

    await expectAsync(input.getProperty('value')).toBeResolvedTo('John');
  });

  it('should query child harnesses', async () => {
    const { inputBoxHarness } = await setupTest({
      dataSkyId: 'my_input_box_last_name',
    });

    const harness = await inputBoxHarness.queryHarness(LastNameHarness);

    await expectAsync(harness.value()).toBeResolvedTo('Doe');
  });
});
