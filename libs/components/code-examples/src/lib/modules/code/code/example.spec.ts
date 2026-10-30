import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyCodeHarness } from '@skyux/code/testing';

import { CodeExample } from './example';

describe('Code example', () => {
  async function setupTest(): Promise<{ loader: HarnessLoader }> {
    const fixture = TestBed.createComponent(CodeExample);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    await fixture.whenStable();

    return { loader };
  }

  it('should get the text of a code component by its data-sky-id', async () => {
    const { loader } = await setupTest();

    const inputName = await loader.getHarness(
      SkyCodeHarness.with({ dataSkyId: 'input-name' }),
    );
    const componentName = await loader.getHarness(
      SkyCodeHarness.with({ dataSkyId: 'component-name' }),
    );

    await expectAsync(inputName.getText()).toBeResolvedTo('headingText');
    await expectAsync(componentName.getText()).toBeResolvedTo('sky-box');
  });

  it('should get every code component in the example', async () => {
    const { loader } = await setupTest();

    const harnesses = await loader.getAllHarnesses(SkyCodeHarness);
    const texts = await Promise.all(
      harnesses.map((harness) => harness.getText()),
    );

    expect(texts).toEqual(['headingText', 'sky-box']);
  });

  it('should throw an error when no code component matches the filter', async () => {
    const { loader } = await setupTest();

    await expectAsync(
      loader.getHarness(SkyCodeHarness.with({ dataSkyId: 'not-found' })),
    ).toBeRejectedWithError(
      /Failed to find element matching one of the following queries/,
    );
  });
});
