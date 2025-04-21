import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TextExpandRepeaterHarnessTestComponent } from './fixtures/text-expand-repeater-harness-test.component';
import { SkyTextExpandRepeaterHarness } from './text-expand-repeater-harness';

describe('Text expand repeater test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    textExpandRepeaterHarness: SkyTextExpandRepeaterHarness;
    fixture: ComponentFixture<TextExpandRepeaterHarnessTestComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [TextExpandRepeaterHarnessTestComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      TextExpandRepeaterHarnessTestComponent,
    );
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const textExpandRepeaterHarness: SkyTextExpandRepeaterHarness =
      options.dataSkyId
        ? await loader.getHarness(
            SkyTextExpandRepeaterHarness.with({
              dataSkyId: options.dataSkyId,
            }),
          )
        : await loader.getHarness(SkyTextExpandRepeaterHarness);

    return { textExpandRepeaterHarness, fixture };
  }

  it('should get the text expand repeater from its data-sky-id', async () => {
    const { textExpandRepeaterHarness } = await setupTest({
      dataSkyId: 'text-expand-repeater',
    });

    const items = await textExpandRepeaterHarness.getItems();

    expect(items.length).toBe(5);
  });

  it('should open and close the text expand repeater', async () => {
    const { textExpandRepeaterHarness } = await setupTest();

    await expectAsync(textExpandRepeaterHarness.isExpanded()).toBeResolvedTo(
      false,
    );
    await textExpandRepeaterHarness.clickExpandCollapseButton();
    await expectAsync(textExpandRepeaterHarness.isExpanded()).toBeResolvedTo(
      true,
    );
    await textExpandRepeaterHarness.clickExpandCollapseButton();
    await expectAsync(textExpandRepeaterHarness.isExpanded()).toBeResolvedTo(
      false,
    );
  });

  it('should throw an error when there is no expand/collapse button', async () => {
    const { textExpandRepeaterHarness, fixture } = await setupTest();

    fixture.componentRef.setInput('maxItems', 5);
    await expectAsync(
      textExpandRepeaterHarness.clickExpandCollapseButton(),
    ).toBeRejectedWithError(
      'Could not find button element. The repeater does not contain enough elements to be expandable.',
    );
  });

  it('should get the list style', async () => {
    const { textExpandRepeaterHarness, fixture } = await setupTest();

    await expectAsync(textExpandRepeaterHarness.getListStyle()).toBeResolvedTo(
      'ordered',
    );
    fixture.componentRef.setInput('style', 'unordered');
    await expectAsync(textExpandRepeaterHarness.getListStyle()).toBeResolvedTo(
      'unordered',
    );
    fixture.componentRef.setInput('style', 'unstyled');
    await expectAsync(textExpandRepeaterHarness.getListStyle()).toBeResolvedTo(
      'unstyled',
    );
  });
});
