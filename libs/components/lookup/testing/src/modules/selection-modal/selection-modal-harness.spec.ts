import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { SelectionModalHarnessTestComponent } from './fixtures/selection-modal-harness-test.component';
import { SelectionModalHarnessTestModule } from './fixtures/selection-modal-harness-test.module';
import { SkySelectionModalHarness } from './selection-modal-harness';

async function setupTest(options: {
  selectMode: 'multiple' | 'single';
  selectionDescriptor?: string;
  showAddButton?: boolean;
  addClick?: () => void;
}): Promise<{
  fixture: ComponentFixture<SelectionModalHarnessTestComponent>;
  harness: SkySelectionModalHarness;
}> {
  await TestBed.configureTestingModule({
    imports: [SelectionModalHarnessTestModule],
  }).compileComponents();

  const fixture = TestBed.createComponent(SelectionModalHarnessTestComponent);

  fixture.componentInstance.showSelectionModal({
    descriptorProperty: 'name',
    idProperty: 'id',
    searchAsync: () => {
      return of({
        items: [
          {
            id: '1',
            name: 'Rachel',
          },
          {
            id: '2',
            name: 'Shirley',
          },
        ],
        totalCount: 2,
      });
    },
    selectMode: options.selectMode,
    selectionDescriptor: options.selectionDescriptor,
    showAddButton: options.showAddButton,
    addClick: options.addClick,
  });

  const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

  const harness = await loader.getHarness(SkySelectionModalHarness);

  return {
    fixture,
    harness,
  };
}

describe('Selection modal harness', () => {
  describe('showAddButton() method', () => {
    it('should return true when the add button is visible', async () => {
      const { harness } = await setupTest({
        selectMode: 'single',
        showAddButton: true,
      });

      await expectAsync(harness.hasAddButton()).toBeResolvedTo(true);
    });

    it('should return false when the add button is not visible', async () => {
      const { harness } = await setupTest({
        selectMode: 'single',
      });

      await expectAsync(harness.hasAddButton()).toBeResolvedTo(false);
    });
  });

  describe('clickAddButton()', () => {
    it('should click the add button when the add button is visible', async () => {
      const addClickSpy = jasmine.createSpy('addClick');

      const { harness } = await setupTest({
        addClick: addClickSpy,
        selectMode: 'single',
        showAddButton: true,
      });

      await harness.clickAddButton();

      expect(addClickSpy).toHaveBeenCalledOnceWith({
        itemAdded: jasmine.any(Function),
      });
    });

    it('should throw an error when the add button is not visible', async () => {
      const { harness } = await setupTest({
        selectMode: 'single',
      });

      await expectAsync(harness.clickAddButton()).toBeRejectedWithError(
        'Could not click the add button because the button could not be found.',
      );
    });
  });

  describe('single select', () => {
    it('should search and select results from the selection modal', async () => {
      const { fixture, harness } = await setupTest({
        selectMode: 'single',
      });

      await harness.enterSearchText('rachel');
      await harness.selectSearchResult({ contentText: 'Rachel' });
      await harness.saveAndClose();

      expect(fixture.componentInstance.selectedItems).toEqual([
        {
          id: '1',
          name: 'Rachel',
        },
      ]);
    });

    it('should throw an error when clicking on non-existent "Select all" button', async () => {
      const { harness } = await setupTest({
        selectMode: 'single',
      });

      await expectAsync(harness.selectAll()).toBeRejectedWithError(
        'Could not select all selections because the "Select all" button could not be found.',
      );
    });

    it('should throw an error when clicking on non-existent "Clear all" button', async () => {
      const { harness } = await setupTest({
        selectMode: 'single',
      });

      await expectAsync(harness.clearAll()).toBeRejectedWithError(
        'Could not clear all selections because the "Clear all" button could not be found.',
      );
    });

    it('should get accessibility labels', async () => {
      const { harness } = await setupTest({
        selectMode: 'single',
        selectionDescriptor: 'person',
      });

      await expectAsync(
        harness.getClearAllButtonAriaLabel(),
      ).toBeRejectedWithError(
        'Could not get the aria-label for the clear all button because the "Clear all" button could not be found.',
      );
      await expectAsync(
        harness.getSelectAllButtonAriaLabel(),
      ).toBeRejectedWithError(
        'Could not get the aria-label for the select all button because the "Select all" button could not be found.',
      );
      await expectAsync(
        harness.getOnlyShowSelectedAriaLabel(),
      ).toBeRejectedWithError(
        'Could not get the "Show only selected items" checkbox because it could not be found.',
      );
      await expectAsync(harness.getSearchAriaLabel()).toBeResolvedTo(
        'Search person',
      );
      await expectAsync(harness.getSaveButtonAriaLabel()).toBeResolvedTo(
        'Select person',
      );
    });
  });

  describe('multiselect', () => {
    it('should select multiple results from the selection modal', async () => {
      const { fixture, harness } = await setupTest({
        selectMode: 'multiple',
      });

      await harness.enterSearchText('ra');
      await harness.selectSearchResult({ contentText: /Shirley|Rachel/ });
      await harness.saveAndClose();

      expect(fixture.componentInstance.selectedItems).toEqual([
        {
          id: '1',
          name: 'Rachel',
        },
        {
          id: '2',
          name: 'Shirley',
        },
      ]);
    });

    it('should get accessibility labels', async () => {
      const { harness } = await setupTest({
        selectMode: 'multiple',
        selectionDescriptor: 'people',
      });

      await expectAsync(harness.getClearAllButtonAriaLabel()).toBeResolvedTo(
        'Clear all selected people',
      );
      await expectAsync(harness.getSelectAllButtonAriaLabel()).toBeResolvedTo(
        'Select all people',
      );
      await expectAsync(harness.getSearchAriaLabel()).toBeResolvedTo(
        'Search people',
      );
      await expectAsync(harness.getSaveButtonAriaLabel()).toBeResolvedTo(
        'Select people',
      );
      await expectAsync(harness.getOnlyShowSelectedAriaLabel()).toBeResolvedTo(
        'Show only selected people',
      );
    });
  });
});
