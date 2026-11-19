import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyCodeBlock } from '@skyux/code';

import { SkyCodeBlockHarness } from './code-block-harness';

@Component({
  imports: [SkyCodeBlock],
  template: `
    <sky-code-block
      data-sky-id="test-code-block"
      [code]="code()"
      [fileName]="fileName()"
      [hideCopyToClipboard]="hideCopyToClipboard()"
      [languageType]="languageType()"
    />
    <sky-code-block data-sky-id="other-code-block" code="a" />
  `,
})
class TestComponent {
  public readonly code = signal('const a = 1;');
  public readonly fileName = signal<string | undefined>('app.ts');
  public readonly hideCopyToClipboard = signal(false);
  public readonly languageType = signal<string | undefined>('typescript');
}

describe('Code block harness', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<TestComponent>;
    harness: SkyCodeBlockHarness;
  }> {
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyCodeBlockHarness.with({ dataSkyId: 'test-code-block' }),
    );

    return { fixture, harness };
  }

  it('should get the code', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getCode()).toBeResolvedTo('const a = 1;');
  });

  it('should keep the indentation of the code', async () => {
    const { fixture, harness } = await setupTest();

    fixture.componentInstance.code.set('\n    if (a) {\n  b();\n    }\n');

    await expectAsync(harness.getCode()).toBeResolvedTo(
      '  if (a) {\nb();\n  }',
    );
  });

  it('should get the file name', async () => {
    const { fixture, harness } = await setupTest();

    await expectAsync(harness.getFileName()).toBeResolvedTo('app.ts');

    fixture.componentInstance.fileName.set(undefined);

    await expectAsync(harness.getFileName()).toBeResolvedTo(undefined);
  });

  it('should get the language name', async () => {
    const { fixture, harness } = await setupTest();

    await expectAsync(harness.getLanguageName()).toBeResolvedTo('TypeScript');

    fixture.componentInstance.languageType.set(undefined);

    await expectAsync(harness.getLanguageName()).toBeResolvedTo(undefined);
  });

  it('should click the copy button', async () => {
    const { harness } = await setupTest();
    const writeTextSpy = spyOn(
      navigator.clipboard,
      'writeText',
    ).and.resolveTo();

    await harness.clickCopyButton();

    expect(writeTextSpy).toHaveBeenCalledOnceWith('const a = 1;');
  });

  it('should throw when clicking a hidden copy button', async () => {
    const { fixture, harness } = await setupTest();

    fixture.componentInstance.hideCopyToClipboard.set(true);

    await expectAsync(harness.clickCopyButton()).toBeRejectedWithError(
      'The code cannot be copied because the copy button is hidden.',
    );
  });

  it('should get a code block by its data-sky-id', async () => {
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyCodeBlockHarness.with({ dataSkyId: 'other-code-block' }),
    );

    await expectAsync(harness.getCode()).toBeResolvedTo('a');
    await expectAsync(
      loader.getHarness(SkyCodeBlockHarness.with({ dataSkyId: 'missing' })),
    ).toBeRejected();
  });
});
