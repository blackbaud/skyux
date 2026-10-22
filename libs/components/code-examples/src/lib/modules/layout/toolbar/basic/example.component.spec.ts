import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyButtonHarness } from '@skyux/forms/testing';
import { SkyToolbarHarness } from '@skyux/layout/testing';

import { LayoutToolbarBasicExampleComponent } from './example.component';

describe('Basic toolbar example', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    toolbarHarness: SkyToolbarHarness;
    fixture: ComponentFixture<LayoutToolbarBasicExampleComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [LayoutToolbarBasicExampleComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(LayoutToolbarBasicExampleComponent);
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

    const toolbarItem1 = await toolbarHarness.getItem({
      dataSkyId: 'toolbar-item-1',
    });
    const toolbarButton = await toolbarItem1.queryHarness(
      SkyButtonHarness.with({ dataSkyId: 'toolbar-button-1' }),
    );

    const viewActionsHarness = await toolbarHarness.getViewActions();
    const expandButton = await viewActionsHarness.queryHarness(
      SkyButtonHarness.with({ dataSkyId: 'expand-button' }),
    );

    const clickSpy = spyOn(fixture.componentInstance, 'onButtonClicked');
    await toolbarButton.click();
    await expandButton.click();
    expect(clickSpy).toHaveBeenCalledTimes(2);
  });
});
