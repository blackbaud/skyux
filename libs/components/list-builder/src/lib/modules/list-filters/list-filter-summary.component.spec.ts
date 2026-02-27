import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { skip, take } from 'rxjs/operators';

import { SkyListToolbarModule } from '../list-toolbar/list-toolbar.module';
import { ListStateDispatcher } from '../list/state/list-state.rxstate';
import { ListState } from '../list/state/list-state.state-node';

import { ListFilterModel } from './filter.model';
import { ListFilterSummaryTestComponent } from './fixtures/list-filter-summary.component.fixture';
import { SkyListFiltersModule } from './list-filters.module';

describe('List filter summary', () => {
  let state: ListState,
    dispatcher: ListStateDispatcher,
    fixture: ComponentFixture<ListFilterSummaryTestComponent>,
    nativeElement: HTMLElement,
    component: ListFilterSummaryTestComponent,
    filters: ListFilterModel[] = [
      new ListFilterModel({
        name: 'color',
        value: 'blue',
        filterFunction: function () {
          return false;
        },
        dismissible: false,
      }),
      new ListFilterModel({
        name: 'type',
        label: 'Berry fruit type',
        value: 'berry',
        filterFunction: function () {
          return true;
        },
      }),
      new ListFilterModel({
        name: 'size',
        label: 'Fruit size',
        value: 'large',
        defaultValue: 'large',
        filterFunction: function () {
          return true;
        },
      })];

  beforeEach(waitForAsync(() => {
    dispatcher = new ListStateDispatcher();
    state = new ListState(dispatcher);

    TestBed.configureTestingModule({
      declarations: [ListFilterSummaryTestComponent],
      imports: [
        SkyListToolbarModule,
        SkyListFiltersModule],
      providers: [
        { provide: ListState, useValue: state },
        { provide: ListStateDispatcher, useValue: dispatcher }],
    });

    fixture = TestBed.createComponent(ListFilterSummaryTestComponent);
    nativeElement = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;
    fixture.detectChanges();
    state.pipe(skip(1), take(1)).subscribe(() => fixture.detectChanges());

    dispatcher.filtersUpdate(filters);
  }));

  function getSummaryItems() {
    return nativeElement.querySelectorAll(
      '.sky-list-toolbar-container .sky-toolbar-section .sky-filter-summary .sky-filter-summary-item',
    );
  }

  it('should show filter summary in the appropriate area when filters exist', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const summaryItems = getSummaryItems();

      // verify first item with no dismiss
      expect(summaryItems.item(0)).toHaveText('blue');
      expect(summaryItems.item(0).querySelector('sky-icon-svg')).toBeNull();

      // verify second item with dismiss and label
      expect(summaryItems.item(1)).toHaveText('Berry fruit type');
      expect(summaryItems.item(1).querySelector('sky-icon-svg')).not.toBeNull();
    });
  }));

  it('should show filter summary in the appropriate area when filters which have no effect exist', waitForAsync(() => {
    filters = filters.concat([
      new ListFilterModel({
        name: 'name',
        label: 'Berry fruit name',
        value: 'joe',
        defaultValue: 'joe',
        filterFunction: function () {
          return true;
        },
      }),
      new ListFilterModel({
        name: 'size',
        label: 'Size',
        value: '',
        filterFunction: function () {
          return true;
        },
      }),
      new ListFilterModel({
        name: 'type',
        label: 'Food type',
        value: undefined,
        filterFunction: function () {
          return true;
        },
      }),
      new ListFilterModel({
        name: 'canEat',
        label: 'Safe to eat',
        value: false,
        filterFunction: function () {
          return true;
        },
      })]);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const summaryItems = getSummaryItems();

      expect(summaryItems.length).toBe(2);

      // verify first item with no dismiss
      expect(summaryItems.item(0)).toHaveText('blue');
      expect(summaryItems.item(0).querySelector('sky-icon-svg')).toBeNull();

      // verify second item with dismiss and label
      expect(summaryItems.item(1)).toHaveText('Berry fruit type');
      expect(summaryItems.item(1).querySelector('sky-icon-svg')).not.toBeNull();
    });
  }));

  it('should emit a click event with the filter', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const summaryItem = getSummaryItems().item(0) as HTMLElement;
      summaryItem.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(component.clickedItem.name).toBe('color');
      });
    });
  }));

  it('should dismiss individual filters properly', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const summaryItems = getSummaryItems();
      const closeButton = summaryItems
        .item(1)
        .querySelector('.sky-token-btn-close') as HTMLElement;
      closeButton.click();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        state.pipe(take(1)).subscribe((current) => {
          expect(current.filters.length).toBe(1);
          expect(current.filters[0].name).toBe('color');
        });
      });
    });
  }));
});
