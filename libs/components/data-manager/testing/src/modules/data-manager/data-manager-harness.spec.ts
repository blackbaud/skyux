import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SkyDataManagerColumnPickerHarness } from './data-manager-column-picker-harness';
import { SkyDataManagerHarness } from './data-manager-harness';
import { SkyDataManagerToolbarHarness } from './data-manager-toolbar-harness';
import { DataManagerHarnessTestComponent } from './fixtures/data-manager-harness-test.component';

describe('Data manager harness', () => {
  async function setupTest(options?: { dataSkyId: string }): Promise<{
    dataManagerHarness: SkyDataManagerHarness;
    fixture: ComponentFixture<DataManagerHarnessTestComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [DataManagerHarnessTestComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(DataManagerHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const dataManagerHarness = options?.dataSkyId
      ? await loader.getHarness(
          SkyDataManagerHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyDataManagerHarness);

    return { dataManagerHarness, fixture };
  }

  it('should get a data manager by data-sky-id', async () => {
    const { dataManagerHarness } = await setupTest({
      dataSkyId: 'data-manager',
    });

    await expectAsync(dataManagerHarness.getToolbar()).toBeResolved();
  });

  it('should get a data view by filter criteria', async () => {
    const { dataManagerHarness } = await setupTest();

    await expectAsync(
      dataManagerHarness.getView({ viewId: 'view-1' }),
    ).toBeResolved();
    await expectAsync(
      dataManagerHarness.getView({ dataSkyId: 'view2' }),
    ).toBeResolved();
  });

  it('should get an array of data views', async () => {
    const { dataManagerHarness } = await setupTest();

    const views = await dataManagerHarness.getViews();

    expect(views.length).toBe(2);
  });

  it('should throw an error if no data views are found matching criteria', async () => {
    const { dataManagerHarness } = await setupTest();

    await expectAsync(
      dataManagerHarness.getViews({ dataSkyId: 'view1' }),
    ).toBeRejectedWithError(
      'Unable to find any data views with filter(s): {"dataSkyId":"view1"}',
    );
  });

  describe('Data manager toolbar', () => {
    async function setupToolbarTest(options?: {
      dataManagerId?: string;
      toolbarId?: string;
    }): Promise<{
      toolbarHarness: SkyDataManagerToolbarHarness;
      dataManagerHarness: SkyDataManagerHarness;
      fixture: ComponentFixture<DataManagerHarnessTestComponent>;
    }> {
      const { dataManagerHarness, fixture } = await setupTest(
        options?.dataManagerId
          ? { dataSkyId: options.dataManagerId }
          : undefined,
      );

      const toolbarHarness = await dataManagerHarness.getToolbar(
        options?.toolbarId ? { dataSkyId: options.toolbarId } : undefined,
      );

      return { toolbarHarness, dataManagerHarness, fixture };
    }

    it('should get data manager toolbar components by data-sky-id', async () => {
      const { toolbarHarness } = await setupToolbarTest({
        dataManagerId: 'data-manager',
        toolbarId: 'data-manager-toolbar',
      });

      await expectAsync(
        toolbarHarness.getPrimaryItem({ dataSkyId: 'primary-item' }),
      ).toBeResolved();
      await expectAsync(
        toolbarHarness.getLeftItem({ dataSkyId: 'left-item' }),
      ).toBeResolved();
      await expectAsync(
        toolbarHarness.getRightItem({ dataSkyId: 'right-item' }),
      ).toBeResolved();
      await expectAsync(
        toolbarHarness.getSection({ dataSkyId: 'toolbar-section' }),
      ).toBeResolved();
    });

    it('should get arrays of data manager toolbar components', async () => {
      const { toolbarHarness } = await setupToolbarTest();

      const primaryItems = await toolbarHarness.getPrimaryItems();
      expect(primaryItems.length).toBe(1);

      const leftItems = await toolbarHarness.getLeftItems();
      expect(leftItems.length).toBe(2);

      const rightItems = await toolbarHarness.getRightItems();
      expect(rightItems.length).toBe(1);

      const sections = await toolbarHarness.getSections();
      expect(sections.length).toBe(1);
    });

    it('should throw an error if no toolbar components are found matching criteria', async () => {
      const { toolbarHarness } = await setupToolbarTest();

      await expectAsync(
        toolbarHarness.getPrimaryItems({ dataSkyId: 'other-item' }),
      ).toBeRejectedWithError(
        'Unable to find any data manager toolbar primary items with filter(s): {"dataSkyId":"other-item"}',
      );
      await expectAsync(
        toolbarHarness.getLeftItems({ dataSkyId: 'other-item' }),
      ).toBeRejectedWithError(
        'Unable to find any data manager toolbar left items with filter(s): {"dataSkyId":"other-item"}',
      );
      await expectAsync(
        toolbarHarness.getRightItems({ dataSkyId: 'other-item' }),
      ).toBeRejectedWithError(
        'Unable to find any data manager toolbar right items with filter(s): {"dataSkyId":"other-item"}',
      );
      await expectAsync(
        toolbarHarness.getSections({ dataSkyId: 'other-section' }),
      ).toBeRejectedWithError(
        'Unable to find any data manager toolbar sections with filter(s): {"dataSkyId":"other-section"}',
      );
    });

    it('should get the view actions', async () => {
      const { toolbarHarness } = await setupToolbarTest();

      const viewActions = await toolbarHarness.getViewActions();
      expect(viewActions).not.toBeNull();
    });

    it('should get the filter button', async () => {
      const { toolbarHarness } = await setupToolbarTest();

      const filterButtonHarness = await toolbarHarness.getFilterButton();
      expect(filterButtonHarness).not.toBeNull();
    });

    it('should get the sort button', async () => {
      const { toolbarHarness } = await setupToolbarTest();

      const sortButtonHarness = await toolbarHarness.getSortButton();
      expect(sortButtonHarness).not.toBeNull();
    });

    it('should get the search bar', async () => {
      const { toolbarHarness } = await setupToolbarTest();

      const searchHarness = await toolbarHarness.getSearch();
      expect(searchHarness).not.toBeNull();
    });

    it('should click the select all button', async () => {
      const { toolbarHarness } = await setupToolbarTest();

      await expectAsync(toolbarHarness.clickSelectAll()).toBeResolved();
    });

    it('should throw an error when attempting to click a select all button that is not present', async () => {
      const { toolbarHarness, fixture } = await setupToolbarTest();

      const view2Action = (
        await (await toolbarHarness.getViewActions())!.getRadioButtons()
      )[1];
      await view2Action.check();

      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(toolbarHarness.clickSelectAll()).toBeRejectedWithError(
        'Unable to find the data manager select all button.',
      );
    });

    it('should click the clear all button', async () => {
      const { toolbarHarness } = await setupToolbarTest();

      await expectAsync(toolbarHarness.clickClearAll()).toBeResolved();
    });

    it('should throw an error when attempting to click a clear all button that is not present', async () => {
      const { toolbarHarness, fixture } = await setupToolbarTest();

      const view2Action = (
        await (await toolbarHarness.getViewActions())!.getRadioButtons()
      )[1];
      await view2Action.check();

      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(toolbarHarness.clickClearAll()).toBeRejectedWithError(
        'Unable to find the data manager clear all button.',
      );
    });

    it('should get the only show selected checkbox', async () => {
      const { toolbarHarness } = await setupToolbarTest();

      const showAllHarness = await toolbarHarness.getOnlyShowSelected();
      expect(showAllHarness).not.toBeNull();
    });

    it('should throw an error when attempting to open column picker that is not present', async () => {
      const { toolbarHarness, fixture } = await setupToolbarTest();

      const view2Action = (
        await (await toolbarHarness.getViewActions())!.getRadioButtons()
      )[1];
      await view2Action.check();

      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(
        toolbarHarness.openColumnPicker(),
      ).toBeRejectedWithError(
        'Unable to find the data manager column picker button.',
      );
    });

    fdescribe('Data manager column picker', () => {
      async function setupColumnPickerTest(): Promise<{
        columnPickerHarness: SkyDataManagerColumnPickerHarness;
        toolbarHarness: SkyDataManagerToolbarHarness;
        dataManagerHarness: SkyDataManagerHarness;
        fixture: ComponentFixture<DataManagerHarnessTestComponent>;
      }> {
        const { toolbarHarness, dataManagerHarness, fixture } =
          await setupToolbarTest();

        const columnPickerHarness = await toolbarHarness.openColumnPicker();

        return {
          columnPickerHarness,
          toolbarHarness,
          dataManagerHarness,
          fixture,
        };
      }

      it('should clear and select all columns', async () => {
        const { columnPickerHarness, fixture } = await setupColumnPickerTest();

        const columns = await columnPickerHarness.getColumns();

        expect(columns.length).toBe(2);

        await expectAsync(columns[0].isSelected()).toBeResolvedTo(true);
        await expectAsync(columns[1].isSelected()).toBeResolvedTo(true);

        await columnPickerHarness.clearAll();
        await columnPickerHarness.selectAll();

        await columns[1].deselect();
        await expectAsync(columns[1].isSelected()).toBeResolvedTo(false);

        await columnPickerHarness.saveAndClose();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.componentInstance.selectedColumns).toEqual([
          'selected',
          'name',
        ]);
      });

      it('should cancel selecting columns', async () => {
        const { columnPickerHarness, fixture } = await setupColumnPickerTest();

        const columns = await columnPickerHarness.getColumns();

        expect(columns.length).toBe(2);

        await expectAsync(columns[0].getTitleText()).toBeResolvedTo(
          'Fruit name',
        );
        await expectAsync(columns[1].getContentText()).toBeResolvedTo(
          'Some information about the fruit.',
        );

        await columns[1].deselect();
        await columnPickerHarness.selectColumns({
          titleText: 'Description',
        });

        await columnPickerHarness.cancel();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.componentInstance.selectedColumns).toEqual([
          'selected',
          'name',
          'description',
        ]);
      });

      it('should search for results', async () => {
        const { columnPickerHarness, fixture } = await setupColumnPickerTest();

        await columnPickerHarness.enterSearchText('fruit');
        fixture.detectChanges();
        await fixture.whenStable();

        const columns = await columnPickerHarness.getColumns();
        expect(columns.length).toBe(2);

        await columnPickerHarness.clearSearchText();

        await expectAsync(
          columnPickerHarness.getColumns({ contentText: 'anything' }),
        ).toBeRejectedWithError(
          'Could not find columns in the column picker matching filter(s): {"contentText":"anything"}',
        );
      });

      it('should get a specific column that matches the given filters', async () => {
        const { columnPickerHarness } = await setupColumnPickerTest();

        const column = await columnPickerHarness.getColumn({
          titleText: 'Fruit name',
        });

        await expectAsync(column.getTitleText()).toBeResolvedTo('Fruit name');
        await expectAsync(column.isSelected()).toBeResolvedTo(true);
      });
    });
  });
});
