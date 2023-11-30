import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyModalConfiguration,
  SkyModalHostService,
  SkyModalInstance,
} from '@skyux/modals';

import { map } from 'rxjs/operators';

import {
  MockSkyModalHostService,
  MockSkyModalInstance,
} from './fixtures/mocks';
import { SelectionModalFixtureService } from './fixtures/selection-modal-fixture.service';
import { SkySelectionModalComponent } from './selection-modal.component';
import { SkySelectionModalContext } from './types/selection-modal-context';
import { SkySelectionModalSearchResult } from './types/selection-modal-search-result';

describe('Selection modal component', () => {
  const modalInstance = new MockSkyModalInstance();
  const modalHost = new MockSkyModalHostService();

  function createSelectionModal(
    config: Partial<SkySelectionModalContext>
  ): ComponentFixture<SkySelectionModalComponent> {
    const defaults: SkySelectionModalContext = {
      descriptorProperty: 'name',
      idProperty: 'id',
      initialSearch: '',
      initialValue: [],
      searchAsync: (args) =>
        TestBed.inject(SelectionModalFixtureService)
          .search(args.searchText)
          .pipe(
            map(
              (results): SkySelectionModalSearchResult => ({
                hasMore: results.hasMore,
                items: results.people,
                totalCount: results.totalCount,
              })
            )
          ),
      selectMode: 'single',
      selectionDescriptor: 'item',
      showAddButton: false,
      userConfig: {},
    };
    const configWithDefaults = Object.assign(defaults, config);

    TestBed.overrideComponent(SkySelectionModalComponent, {
      set: {
        providers: [
          { provide: SkySelectionModalContext, useValue: configWithDefaults },
          { provide: SkyModalInstance, useValue: modalInstance },
        ],
      },
    });

    return TestBed.createComponent(SkySelectionModalComponent);
  }

  function getClearAllButton(
    fixture: ComponentFixture<SkySelectionModalComponent>
  ): HTMLButtonElement | undefined {
    return fixture.nativeElement.querySelector(
      '.sky-lookup-show-more-modal-clear-all-btn'
    );
  }

  function getHeader(
    fixture: ComponentFixture<SkySelectionModalComponent>
  ): HTMLElement | undefined {
    return fixture.nativeElement.querySelector('sky-modal-header');
  }

  function getSearchInput(
    fixture: ComponentFixture<SkySelectionModalComponent>
  ): HTMLInputElement | undefined {
    return fixture.nativeElement.querySelector('sky-search input');
  }

  function getSelectButton(
    fixture: ComponentFixture<SkySelectionModalComponent>
  ): HTMLButtonElement | undefined {
    return fixture.nativeElement.querySelector(
      '.sky-lookup-show-more-modal-save'
    );
  }

  function getSelectAllButton(
    fixture: ComponentFixture<SkySelectionModalComponent>
  ): HTMLButtonElement | undefined {
    return fixture.nativeElement.querySelector(
      '.sky-lookup-show-more-modal-select-all-btn'
    );
  }

  function getOnlySelectedInput(
    fixture: ComponentFixture<SkySelectionModalComponent>
  ): HTMLInputElement | undefined {
    return fixture.nativeElement.querySelector(
      'sky-toolbar-view-actions sky-checkbox input'
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      providers: [
        SelectionModalFixtureService,
        { provide: SkyModalHostService, useValue: modalHost },
        { provide: SkyModalConfiguration, useValue: {} },
      ],
    });
  });

  it('should set the title and accessibility labels using the value of the selection descriptor - single select', async () => {
    const fixture = createSelectionModal({
      selectionDescriptor: 'person',
    });
    fixture.detectChanges();
    await fixture.whenStable();

    const selectButton = getSelectButton(fixture);

    expect(getHeader(fixture)?.textContent.trim()).toBe('Select person');
    expect(getSearchInput(fixture)?.getAttribute('aria-label')).toBe(
      'Search person'
    );
    // Test that button text isn't contextual and only the `aria-label`
    expect(selectButton?.textContent.trim()).toBe('Select');
    expect(selectButton?.getAttribute('aria-label')).toBe('Select person');
    expect(getClearAllButton(fixture)).toBeNull();
    expect(getSelectAllButton(fixture)).toBeNull();
    expect(getOnlySelectedInput(fixture)).toBeNull();
  });

  it('should set the title and accessibility labels using the value of the selection descriptor - multi-select', async () => {
    const fixture = createSelectionModal({
      selectionDescriptor: 'people',
      selectMode: 'multiple',
    });
    fixture.detectChanges();
    await fixture.whenStable();

    const selectButton = getSelectButton(fixture);

    expect(getHeader(fixture)?.textContent.trim()).toBe('Select people');
    expect(getSearchInput(fixture)?.getAttribute('aria-label')).toBe(
      'Search people'
    );
    // Test that button text isn't contextual and only the `aria-label`
    expect(selectButton?.textContent.trim()).toBe('Select');
    expect(selectButton?.getAttribute('aria-label')).toBe('Select people');

    // Test that button text isn't contextual and only the `aria-label`
    expect(getClearAllButton(fixture)?.textContent.trim()).toBe('Clear all');
    expect(getClearAllButton(fixture).getAttribute('aria-label')).toBe(
      'Clear all selected people'
    );

    // Test that button text isn't contextual and only the `aria-label`
    expect(getSelectAllButton(fixture)?.textContent.trim()).toBe('Select all');
    expect(getSelectAllButton(fixture).getAttribute('aria-label')).toBe(
      'Select all people'
    );

    expect(getOnlySelectedInput(fixture).getAttribute('aria-label')).toBe(
      'Show only selected people'
    );
  });
});
