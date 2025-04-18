import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyTextExpandRepeaterHarness } from '@skyux/layout/testing';

import { LayoutTextExpandRepeaterExampleComponent } from './example.component';

describe('Text expand inline example', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    textExpandRepeaterHarness: SkyTextExpandRepeaterHarness;
  }> {
    await TestBed.configureTestingModule({
      imports: [LayoutTextExpandRepeaterExampleComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      LayoutTextExpandRepeaterExampleComponent,
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

    return { textExpandRepeaterHarness };
  }

  it('should set up the text expand repeater', async () => {
    const { textExpandRepeaterHarness } = await setupTest();

    await textExpandRepeaterHarness.clickExpandCollapseButton();

    await expectAsync(textExpandRepeaterHarness.isExpanded()).toBeResolvedTo(
      true,
    );

    const items = await textExpandRepeaterHarness.getItems();

    await expectAsync((await items[2].host()).text()).toBeResolvedTo(
      'Repeater item 3',
    );
  });
});
