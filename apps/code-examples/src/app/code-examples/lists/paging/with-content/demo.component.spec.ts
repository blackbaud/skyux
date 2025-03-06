import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyPagingHarness, SkyRepeaterHarness } from '@skyux/lists/testing';

import { DemoComponent } from './demo.component';

describe('Paging demo', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    pagingHarness: SkyPagingHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [DemoComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const pagingHarness: SkyPagingHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyPagingHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyPagingHarness);

    return { pagingHarness, fixture };
  }

  it('should set up the paging content', async () => {
    const { pagingHarness, fixture } = await setupTest({
      dataSkyId: 'my-paging-content',
    });

    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(1);

    const contentHarness = await (
      await pagingHarness.getPagingContent()
    ).queryHarness(SkyRepeaterHarness);

    let items = await contentHarness.getRepeaterItems();

    await expectAsync(items[0].getTitleText()).toBeResolvedTo('Abed');

    await pagingHarness.clickPageButton(3);

    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(3);

    items = await contentHarness.getRepeaterItems();

    await expectAsync(items[0].getTitleText()).toBeResolvedTo('Leonard');

    await pagingHarness.clickNextButton();

    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(pagingHarness.getCurrentPage()).toBeResolvedTo(4);

    items = await contentHarness.getRepeaterItems();

    await expectAsync(items[0].getTitleText()).toBeResolvedTo('Shirley');

    await expectAsync(pagingHarness.clickNextButton()).toBeRejectedWithError(
      'Could not click the next button because it is disabled.',
    );

    await expectAsync(pagingHarness.clickPageButton(1)).toBeRejectedWithError(
      'Could not find page button 1.',
    );
  });
});
