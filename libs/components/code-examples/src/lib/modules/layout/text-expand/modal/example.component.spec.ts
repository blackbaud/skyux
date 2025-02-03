import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyTextExpandHarness } from '@skyux/layout/testing';

import { LayoutTextExpandModalExampleComponent } from './example.component';

describe('Text expand modal example', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    textExpandHarness: SkyTextExpandHarness;
  }> {
    await TestBed.configureTestingModule({
      imports: [LayoutTextExpandModalExampleComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      LayoutTextExpandModalExampleComponent,
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

  it('should open and close the text expand modal', async () => {
    const { textExpandHarness } = await setupTest();

    await expectAsync(textExpandHarness.textExpandsToModal()).toBeResolvedTo(
      true,
    );
    await expectAsync(textExpandHarness.isExpanded()).toBeResolvedTo(false);

    await textExpandHarness.clickExpandCollapseButton();
    const modal = await textExpandHarness.getExpandedViewModal();

    await expectAsync(modal.getText()).toBeResolvedTo(
      'The text expand component truncates long blocks of text with an ellipsis and a link to expand the text. Users select the link to expand the full text inline unless it exceeds limits on text characters or newline characters. If the text exceeds those limits, then it expands in a modal view instead. The component does not truncate text that is shorter than a specified threshold, and by default, it removes newline characters from truncated text.',
    );
    await expectAsync(modal.getExpandModalTitle()).toBeResolvedTo(
      'Expanded view',
    );
    await expectAsync(textExpandHarness.isExpanded()).toBeResolvedTo(true);

    await modal.clickCloseButton();

    await expectAsync(
      textExpandHarness.getExpandedViewModal(),
    ).toBeRejectedWithError('Could not find text expand modal.');
    await expectAsync(textExpandHarness.isExpanded()).toBeResolvedTo(false);
  });
});
