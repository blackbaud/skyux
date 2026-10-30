import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkyCodeComponent } from '@skyux/code';

import { SkyCodeHarness } from './code-harness';

@Component({
  imports: [SkyCodeComponent],
  template: `
    <sky-code>.npmrc</sky-code>
    <sky-code data-sky-id="test-code">SkyCodeComponent</sky-code>
  `,
})
class TestComponent {}

describe('Code harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    harness: SkyCodeHarness;
  }> {
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = options.dataSkyId
      ? await loader.getHarness(
          SkyCodeHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyCodeHarness);

    return { harness };
  }

  it('should get the text', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getText()).toBeResolvedTo('.npmrc');
  });

  it('should get a code component by its data-sky-id', async () => {
    const { harness } = await setupTest({ dataSkyId: 'test-code' });

    await expectAsync(harness.getText()).toBeResolvedTo('SkyCodeComponent');
  });

  it('should throw when no code component matches the data-sky-id', async () => {
    await expectAsync(
      setupTest({ dataSkyId: 'not-found' }),
    ).toBeRejectedWithError(
      /Failed to find element matching one of the following queries/,
    );
  });
});
