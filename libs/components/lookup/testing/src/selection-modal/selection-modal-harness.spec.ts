import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { SelectionModalHarnessTestComponent } from './fixtures/selection-modal-harness-test.component';
import { SelectionModalHarnessTestModule } from './fixtures/selection-modal-harness-test.module';
import { SkySelectionModalHarness } from './selection-modal-harness';

async function setupTest(options: {
  selectMode: 'multiple' | 'single';
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
  });

  const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

  const harness = await loader.getHarness(SkySelectionModalHarness);

  return {
    fixture,
    harness,
  };
}

describe('Selection modal harness', () => {
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
        'Could not select all selections because the "Select all" button could not be found.'
      );
    });

    it('should throw an error when clicking on non-existent "Clear all" button', async () => {
      const { harness } = await setupTest({
        selectMode: 'single',
      });

      await expectAsync(harness.clearAll()).toBeRejectedWithError(
        'Could not clear all selections because the "Clear all" button could not be found.'
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
  });
});
