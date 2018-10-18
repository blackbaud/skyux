import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  async
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import { SkySortModule } from './sort.module';

import { SortTestComponent } from './fixtures/sort.component.fixture';

describe('Sort component', () => {
  let fixture: ComponentFixture<SortTestComponent>;
  let nativeElement: HTMLElement;
  let component: SortTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SortTestComponent
      ],
      imports: [
        SkySortModule
      ]
    });

    fixture = TestBed.createComponent(SortTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
  });

  function getDropdownButtonEl() {
    let dropdownButtonQuery = '.sky-sort .sky-dropdown .sky-dropdown-button';
    return nativeElement.querySelector(dropdownButtonQuery) as HTMLElement;
  }

  function getDropdownMenuEl() {
    let dropdownMenuQuery = '.sky-sort .sky-dropdown-menu';
    return nativeElement.querySelector(dropdownMenuQuery) as HTMLElement;
  }

  function getSortItems() {
    let itemQuery = '.sky-sort .sky-dropdown-menu .sky-sort-item';
    return nativeElement.querySelectorAll(itemQuery);
  }

  function verifyTextPresent() {
    expect(getDropdownButtonEl().innerText.trim()).toBe('Sort');
  }

  function verifyTextNotPresent() {
    expect(getDropdownButtonEl().innerText.trim()).not.toBe('Sort');
  }

  it('creates a sort dropdown that respects active input', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    let dropdownButtonEl = getDropdownButtonEl();
    expect(dropdownButtonEl).not.toBeNull();

    dropdownButtonEl.click();
    tick();
    fixture.detectChanges();
    tick();

    let menuHeaderQuery = '.sky-sort-menu-heading';
    expect(nativeElement.querySelector(menuHeaderQuery)).toHaveText('Sort by');

    let itemsEl = getSortItems();
    expect(itemsEl.length).toBe(6);
    expect(itemsEl.item(2)).toHaveCssClass('sky-sort-item-selected');
    expect(itemsEl.item(2)).toHaveText('Date created (newest first)');
  }));

  it('creates a sort dropdown with the proper label and title', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    let dropdownButtonEl = getDropdownButtonEl();
    expect(dropdownButtonEl.getAttribute('aria-label')).toBe('Sort');
    expect(dropdownButtonEl.getAttribute('title')).toBe('Sort');

    dropdownButtonEl.click();
    tick();
    fixture.detectChanges();
    tick();

    expect(getDropdownMenuEl().getAttribute('aria-labelledby')).toBe(
      nativeElement.querySelector('.sky-sort-menu-heading').getAttribute('id')
    );
  }));

  it('changes active item on click and emits proper event', fakeAsync(() => {
    fixture.detectChanges();
    let dropdownButtonEl = getDropdownButtonEl();
    dropdownButtonEl.click();
    tick();
    fixture.detectChanges();
    tick();

    let itemsEl = getSortItems();
    let clickItem = itemsEl.item(1).querySelector('button') as HTMLElement;

    clickItem.click();
    tick();
    fixture.detectChanges();
    tick();

    expect(component.sortedItem).toEqual({
      id: 2,
      label: 'Assigned to (Z - A)',
      name: 'assignee',
      descending: true
    });

    itemsEl = getSortItems();
    expect(itemsEl.item(1)).toHaveCssClass('sky-sort-item-selected');
  }));

  it('can set active input programmatically', () => {
    fixture.detectChanges();
    component.initialState = 4;
    fixture.detectChanges();
    let itemsEl = getSortItems();
    expect(itemsEl.item(3)).toHaveCssClass('sky-sort-item-selected');
  });

  it('should allow button text to be hidden', () => {
    fixture.detectChanges();
    verifyTextNotPresent();
    component.showButtonText = true;
    fixture.detectChanges();
    verifyTextPresent();
  });

  it('should be accessible', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
