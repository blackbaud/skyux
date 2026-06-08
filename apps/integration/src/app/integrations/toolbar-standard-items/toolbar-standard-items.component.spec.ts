import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarStandardItemsComponent } from './toolbar-standard-items.component';
import { ToolbarStandardItemsModule } from './toolbar-standard-items.module';

describe('Toolbar with standard items', () => {
  function getFilterButton(): HTMLElement | null {
    return document.querySelector('.sky-filter-btn');
  }

  function getSearchInput(): HTMLElement | null {
    return document.querySelector('.sky-search-input');
  }

  function getSortButton(): HTMLElement | null {
    return document.querySelector('.sky-sort .sky-dropdown-button');
  }

  let fixture: ComponentFixture<ToolbarStandardItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToolbarStandardItemsModule],
    });

    fixture = TestBed.createComponent(ToolbarStandardItemsComponent);
    fixture.detectChanges();
  });

  it('should use default aria labels when no list descriptor is given', () => {
    expect(getFilterButton()?.getAttribute('aria-label')).toBe('Filter');
    expect(getSearchInput()?.getAttribute('aria-label')).toBe('Search items');
    expect(getSortButton()?.getAttribute('aria-label')).toBe('Sort');
  });

  it('should the list descriptor for default aria labels when it is given', async () => {
    fixture.componentInstance.listDescriptor = 'constituents';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(getFilterButton()?.getAttribute('aria-label')).toBe(
      'Filter constituents',
    );
    expect(getSearchInput()?.getAttribute('aria-label')).toBe(
      'Search constituents',
    );
    expect(getSortButton()?.getAttribute('aria-label')).toBe(
      'Sort constituents',
    );
  });
});
