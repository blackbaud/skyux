import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyButtonHarness } from '@skyux/forms/testing';
import { SkyToolbarHarness } from '@skyux/layout/testing';

import { LayoutToolbarSectionedExampleComponent } from './example.component';

describe('Sectioned toolbar example', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    toolbarHarness: SkyToolbarHarness;
    fixture: ComponentFixture<LayoutToolbarSectionedExampleComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [LayoutToolbarSectionedExampleComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      LayoutToolbarSectionedExampleComponent,
    );
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
    const toolbarButton = await toolbarItem1.queryHarness(
      SkyButtonHarness.with({ dataSkyId: 'toolbar-button-1' }),
    );

    const viewActionsHarness = await toolbarSectionHarness.getViewActions();
    const expandButton = await viewActionsHarness.queryHarness(
      SkyButtonHarness.with({ dataSkyId: 'expand-button' }),
    );

    const clickSpy = spyOn(fixture.componentInstance, 'onButtonClicked');
    await toolbarButton.click();
    await expandButton.click();
    expect(clickSpy).toHaveBeenCalledTimes(2);
  });
});
