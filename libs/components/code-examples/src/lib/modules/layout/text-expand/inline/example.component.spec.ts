import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyTextExpandHarness } from '@skyux/layout/testing';

import { LayoutTextExpandInlineExampleComponent } from './example.component';

describe('Text expand inline example', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    textExpandHarness: SkyTextExpandHarness;
  }> {
    await TestBed.configureTestingModule({
      imports: [LayoutTextExpandInlineExampleComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      LayoutTextExpandInlineExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const textExpandHarness: SkyTextExpandHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyTextExpandHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyTextExpandHarness);

    return { textExpandHarness };
  }

  it('should set up the text expand', async () => {
    const { textExpandHarness } = await setupTest();

    await expectAsync(textExpandHarness.textExpandsToModal()).toBeResolvedTo(
      false,
    );

    await textExpandHarness.clickExpandCollapseButton();

    await expectAsync(textExpandHarness.getText()).toBeResolvedTo(
      'The text expand component truncates long blocks of text with an ellipsis and a link to expand the text. Users select the link to expand the full text inline unless it exceeds limits on text characters or newline characters. If the text exceeds those limits, then it expands in a modal view instead. The component does not truncate text that is shorter than a specified threshold, and by default, it removes newline characters from truncated text.',
    );
    await expectAsync(textExpandHarness.isExpanded()).toBeResolvedTo(true);

    await textExpandHarness.clickExpandCollapseButton();

    await expectAsync(textExpandHarness.getText()).toBeResolvedTo(
      'The text expand component truncates long blocks of text with an ellipsis and a link to expand the text. Users select the link to expand the full text inline unless it exceeds limits on text characters',
    );
    await expectAsync(textExpandHarness.isExpanded()).toBeResolvedTo(false);
  });
});
