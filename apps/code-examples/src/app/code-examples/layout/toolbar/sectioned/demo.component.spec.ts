import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyToolbarHarness } from '@skyux/layout/testing';

import { DemoComponent } from './demo.component';

describe('Sectioned toolbar demo', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    toolbarHarness: SkyToolbarHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [DemoComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const toolbarHarness: SkyToolbarHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyToolbarHarness.with({
            dataSkyId: options.dataSkyId,
          }),
        )
      : await loader.getHarness(SkyToolbarHarness);

    return { toolbarHarness, fixture };
  }

  it('should set up the toolbar', async () => {
    const { toolbarHarness, fixture } = await setupTest();

    const toolbarSectionHarness = await toolbarHarness.getSection({
      dataSkyId: 'top-section',
    });

    const toolbarItem1 = await toolbarSectionHarness.getItem({
      dataSkyId: 'toolbar-item-1',
    });
    const toolbarButton = await toolbarItem1.querySelector('button');

    const viewActionsHarness = await toolbarSectionHarness.getViewActions();
    const expandButton = (
      await viewActionsHarness.querySelectorAll('button')
    )[0];

    const clickSpy = spyOn(fixture.componentInstance, 'onButtonClicked');
    await toolbarButton?.click();
    await expandButton.click();
    expect(clickSpy).toHaveBeenCalledTimes(2);
  });
});
