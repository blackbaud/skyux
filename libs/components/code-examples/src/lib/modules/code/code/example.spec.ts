import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyCodeHarness } from '@skyux/code/testing';

import { CodeExample } from './example';

describe('Code example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    codeHarness: SkyCodeHarness;
  }> {
    const fixture = TestBed.createComponent(CodeExample);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const codeHarness = await loader.getHarness(
      SkyCodeHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { codeHarness };
  }

  it('should show the input name as code', async () => {
    const { codeHarness } = await setupTest({ dataSkyId: 'input-name' });

    await expectAsync(codeHarness.getText()).toBeResolvedTo('headingText');
  });

  it('should show the component name as code', async () => {
    const { codeHarness } = await setupTest({ dataSkyId: 'component-name' });

    await expectAsync(codeHarness.getText()).toBeResolvedTo('sky-box');
  });
});
