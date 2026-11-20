import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyCodeBlockHarness } from '@skyux/code/testing';

import { CodeCodeBlockFileNameExample } from './example';

describe('Code block with a file name example', () => {
  async function setupTest(): Promise<{
    codeBlockHarness: SkyCodeBlockHarness;
  }> {
    const fixture = TestBed.createComponent(CodeCodeBlockFileNameExample);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const codeBlockHarness = await loader.getHarness(
      SkyCodeBlockHarness.with({ dataSkyId: 'greeting-code' }),
    );

    return { codeBlockHarness };
  }

  it('should show the TypeScript code with its file name', async () => {
    const { codeBlockHarness } = await setupTest();

    await expectAsync(codeBlockHarness.getFileName()).toBeResolvedTo(
      'greeting.ts',
    );
    await expectAsync(codeBlockHarness.getLanguageName()).toBeResolvedTo(
      'TypeScript',
    );
    await expectAsync(codeBlockHarness.getCode()).toBeResolvedTo(
      [
        'export function greet(name: string): string {',
        `  return \`Hello, \${name}!\`;`,
        '}',
      ].join('\n'),
    );
  });

  it('should copy the code to the clipboard', async () => {
    const { codeBlockHarness } = await setupTest();
    const writeTextSpy = spyOn(
      navigator.clipboard,
      'writeText',
    ).and.resolveTo();

    await codeBlockHarness.clickCopyButton();

    expect(writeTextSpy).toHaveBeenCalledOnceWith(
      await codeBlockHarness.getCode(),
    );
  });
});
