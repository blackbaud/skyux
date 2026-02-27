import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';

import { TextExpandHarnessTestComponent } from './fixtures/text-expand-harness-test.component';
import { SkyTextExpandHarness } from './text-expand-harness';

describe('Text expand test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    textExpandHarness: SkyTextExpandHarness;
  }> {
    await TestBed.configureTestingModule({
      imports: [TextExpandHarnessTestComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TextExpandHarnessTestComponent);
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

  it('should get the text expand from its data-sky-id', async () => {
    const { textExpandHarness } = await setupTest({
      dataSkyId: 'basic',
    });

    await expectAsync(textExpandHarness.getText()).toBeResolvedTo(
      'The text expand component truncates long blocks of text with an ellipsis and a link to expand the text. Users select the link to expand the full text inline unless it exceeds limits on text characters',
    );
  });

  it('should throw an error when there is no text to display', async () => {
    const { textExpandHarness } = await setupTest({
      dataSkyId: 'empty',
    });

    await expectAsync(textExpandHarness.getText()).toBeResolvedTo('');
    await expectAsync(
      textExpandHarness.clickExpandCollapseButton(),
    ).toBeRejectedWithError('Could not find button element.');
  });

  it('should open and close the text expand', async () => {
    const { textExpandHarness } = await setupTest({
      dataSkyId: 'basic',
    });

    await textExpandHarness.clickExpandCollapseButton();

    await expectAsync(textExpandHarness.getText()).toBeResolvedTo(
      'The text expand component truncates long blocks of text with an ellipsis and a link to expand the text. Users select the link to expand the full text inline unless it exceeds limits on text characters or newline characters. If the text exceeds those limits, then it expands in a modal view instead. The component does not truncate text that is shorter than a specified threshold, and by default, it removes newline characters from truncated text.',
    );

    await textExpandHarness.clickExpandCollapseButton();

    await expectAsync(textExpandHarness.getText()).toBeResolvedTo(
      'The text expand component truncates long blocks of text with an ellipsis and a link to expand the text. Users select the link to expand the full text inline unless it exceeds limits on text characters',
    );
  });

  it('should open and close the modal when configured to do so', async () => {
    const { textExpandHarness } = await setupTest({
      dataSkyId: 'modal',
    });

    await textExpandHarness.clickExpandCollapseButton();

    const modal = await textExpandHarness.getExpandedViewModal();

    await expectAsync(modal.getText()).toBeResolvedTo(
      'The text expand component truncates long blocks of text with an ellipsis and a link to expand the text. Users select the link to expand the full text inline unless it exceeds limits on text characters or newline characters. If the text exceeds those limits, then it expands in a modal view instead. The component does not truncate text that is shorter than a specified threshold, and by default, it removes newline characters from truncated text.',
    );
    await expectAsync(modal.getExpandModalTitle()).toBeResolvedTo(
      'Expanded view',
    );
    await modal.clickCloseButton();

    await expectAsync(
      textExpandHarness.getExpandedViewModal(),
    ).toBeRejectedWithError('Could not find text expand modal.');
  });

  it('should get whether the text will expand to a modal', async () => {
    const { textExpandHarness } = await setupTest({
      dataSkyId: 'modal',
    });

    await expectAsync(textExpandHarness.textExpandsToModal()).toBeResolvedTo(
      true,
    );
  });

  it('should get whether the text will not expand to a modal', async () => {
    const { textExpandHarness } = await setupTest({
      dataSkyId: 'basic',
    });

    await expectAsync(textExpandHarness.textExpandsToModal()).toBeResolvedTo(
      false,
    );
  });

  it('should get whether text is expanded in inline mode', async () => {
    const { textExpandHarness } = await setupTest({
      dataSkyId: 'basic',
    });

    await expectAsync(textExpandHarness.isExpanded()).toBeResolvedTo(false);

    await textExpandHarness.clickExpandCollapseButton();

    await expectAsync(textExpandHarness.isExpanded()).toBeResolvedTo(true);
  });

  it('should get whether text is expanded in modal mode', async () => {
    const { textExpandHarness } = await setupTest({
      dataSkyId: 'modal',
    });

    await expectAsync(textExpandHarness.isExpanded()).toBeResolvedTo(false);

    await textExpandHarness.clickExpandCollapseButton();

    await expectAsync(textExpandHarness.isExpanded()).toBeResolvedTo(true);

    const modal = await textExpandHarness.getExpandedViewModal();
    await modal.clickCloseButton();

    await expectAsync(textExpandHarness.isExpanded()).toBeResolvedTo(false);
  });
});
