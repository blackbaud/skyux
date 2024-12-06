import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TextExpandHarnessTestComponent } from './fixtures/text-expand-harness-test.component';
import { SkyTextExpandHarness } from './text-expand-harness';

describe('Text expand test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    textExpandHarness: SkyTextExpandHarness;
    fixture: ComponentFixture<TextExpandHarnessTestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [TextExpandHarnessTestComponent, NoopAnimationsModule],
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

    return { textExpandHarness, fixture, loader };
  }

  it('should get the text expand from its data-sky-id', async () => {
    const { textExpandHarness, fixture } = await setupTest({
      dataSkyId: 'basic',
    });

    fixture.detectChanges();

    await expectAsync(textExpandHarness.getText()).toBeResolvedTo(
      'The text expand component truncates long blocks of text with an ellipsis and a link to expand the text. Users select the link to expand the full text inline unless it exceeds limits on text characters',
    );
  });

  it('should throw an error when there is no text to display', async () => {
    const { textExpandHarness, fixture } = await setupTest({
      dataSkyId: 'empty',
    });

    fixture.detectChanges();

    await expectAsync(textExpandHarness.getText()).toBeResolvedTo('');
    await expectAsync(
      textExpandHarness.clickSeeMoreButton(),
    ).toBeRejectedWithError('Could not find button element.');
  });

  it('should open and close the text expand', async () => {
    const { textExpandHarness, fixture } = await setupTest({
      dataSkyId: 'basic',
    });

    fixture.detectChanges();
    await fixture.whenStable();

    await textExpandHarness.clickSeeMoreButton();

    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(textExpandHarness.getText()).toBeResolvedTo(
      'The text expand component truncates long blocks of text with an ellipsis and a link to expand the text. Users select the link to expand the full text inline unless it exceeds limits on text characters or newline characters. If the text exceeds those limits, then it expands in a modal view instead. The component does not truncate text that is shorter than a specified threshold, and by default, it removes newline characters from truncated text.',
    );

    await textExpandHarness.clickSeeMoreButton();

    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(textExpandHarness.getText()).toBeResolvedTo(
      'The text expand component truncates long blocks of text with an ellipsis and a link to expand the text. Users select the link to expand the full text inline unless it exceeds limits on text characters',
    );
  });

  it('should open and close the modal when configured to do so', async () => {
    const { textExpandHarness, fixture } = await setupTest({
      dataSkyId: 'modal',
    });

    fixture.detectChanges();
    await fixture.whenStable();

    await textExpandHarness.clickSeeMoreButton();

    const modal = await textExpandHarness.getModal();

    await expectAsync(modal.getText()).toBeResolvedTo(
      'The text expand component truncates long blocks of text with an ellipsis and a link to expand the text. Users select the link to expand the full text inline unless it exceeds limits on text characters or newline characters. If the text exceeds those limits, then it expands in a modal view instead. The component does not truncate text that is shorter than a specified threshold, and by default, it removes newline characters from truncated text.',
    );
    await expectAsync(modal.getExpandModalTitle()).toBeResolvedTo(
      'Expanded view',
    );
    await modal.clickCloseButton();

    await expectAsync(textExpandHarness.getModal()).toBeRejectedWithError(
      'Could not find text expand modal.',
    );
  });
});
