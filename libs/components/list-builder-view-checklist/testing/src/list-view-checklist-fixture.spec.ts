import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyListModule, SkyListToolbarModule } from '@skyux/list-builder';
import { SkyListViewChecklistModule } from '@skyux/list-builder-view-checklist';

import { of as observableOf } from 'rxjs';
import { take } from 'rxjs/operators';

import { SkyListViewChecklistFixture } from './list-view-checklist-fixture';

const testItems = [
  { id: '1', column1: 101, column2: 'Apple', column3: 'Anne eats apples' },
  { id: '2', column1: 202, column2: 'Banana', column3: 'Ben eats bananas' },
  { id: '3', column1: 303, column2: 'Pear', column3: 'Patty eats pears' },
  { id: '4', column1: 404, column2: 'Grape', column3: 'George eats grapes' },
  { id: '5', column1: 505, column2: 'Banana', column3: 'Becky eats bananas' },
  { id: '6', column1: 606, column2: 'Lemon', column3: 'Larry eats lemons' },
  {
    id: '7',
    column1: 707,
    column2: 'Strawberry',
    column3: 'Sally eats strawberries',
  },
];

//#region Test component
@Component({
  selector: 'sky-list-view-checklist-test',
  template: `
    <sky-list [data]="items" (selectedIdsChange)="selectedItemsChange($event)">
      <sky-list-toolbar> </sky-list-toolbar>
      <sky-list-view-checklist
        label="column2"
        description="column3"
        [selectMode]="selectMode"
        data-sky-id="my-list-view-checklist"
      >
      </sky-list-view-checklist>
    </sky-list>
  `,
})
class TestComponent {
  public items = observableOf(testItems);

  public selectedItems: typeof testItems = [];

  public selectMode: string = 'multiple';

  public selectedItemsChange(selectedMap: Map<string, boolean>) {
    this.items.pipe(take(1)).subscribe((items) => {
      this.selectedItems = items.filter((item) => {
        return selectedMap.get(item.id);
      });
    });
  }
}
//#endregion Test component

describe('List view checklist fixture', () => {
  const SELECT_MODE_SINGLE = 'single';

  function getChecklistFixture(
    fixture: ComponentFixture<TestComponent>
  ): SkyListViewChecklistFixture {
    return new SkyListViewChecklistFixture(fixture, 'my-list-view-checklist');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [
        NoopAnimationsModule,
        SkyListModule,
        SkyListToolbarModule,
        SkyListViewChecklistModule,
      ],
    });
  });

  it('should allow an item to be retrieved by index', () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    const listViewChecklist = getChecklistFixture(fixture);

    listViewChecklist.selectItem(1);

    fixture.detectChanges();

    const item = listViewChecklist.getItem(1);

    expect(item).toEqual({
      label: 'Banana',
      description: 'Ben eats bananas',
      selected: true,
    });

    expect(() => listViewChecklist.getItem(100)).toThrowError(
      'No item exists at index 100.'
    );
  });

  it('should allow an item to be selected by index', () => {
    const expectedSelectedItems = [testItems[1], testItems[3], testItems[4]];

    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    const listViewChecklist = new SkyListViewChecklistFixture(
      fixture,
      'my-list-view-checklist'
    );

    listViewChecklist.selectItem(1);
    listViewChecklist.selectItem(3);
    listViewChecklist.selectItem(4);

    fixture.detectChanges();

    expect(fixture.componentInstance.selectedItems).toEqual(
      expectedSelectedItems
    );

    // Ensure the item doesn't get de-selected by selecting it twice.
    listViewChecklist.selectItem(4);

    expect(fixture.componentInstance.selectedItems).toEqual(
      expectedSelectedItems
    );

    expect(() => listViewChecklist.selectItem(100)).toThrowError(
      'No item exists at index 100.'
    );
  });

  it('should allow an item to be deselected by index', () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    const listViewChecklist = getChecklistFixture(fixture);

    listViewChecklist.selectItem(1);

    fixture.detectChanges();

    expect(fixture.componentInstance.selectedItems).toEqual([testItems[1]]);

    listViewChecklist.deselectItem(1);

    expect(fixture.componentInstance.selectedItems).toEqual([]);

    // Ensure the item doesn't get selected by deselecting it twice.
    listViewChecklist.deselectItem(1);

    expect(fixture.componentInstance.selectedItems).toEqual([]);

    expect(() => listViewChecklist.deselectItem(100)).toThrowError(
      'No item exists at index 100.'
    );
  });

  describe('when selectMode is single', () => {
    it('should allow an item to be retrieved by index', () => {
      const fixture = TestBed.createComponent(TestComponent);

      fixture.componentInstance.selectMode = SELECT_MODE_SINGLE;

      fixture.detectChanges();

      const listViewChecklist = getChecklistFixture(fixture);

      listViewChecklist.selectItem(1);

      fixture.detectChanges();

      const item = listViewChecklist.getItem(1);

      expect(item).toEqual({
        label: 'Banana',
        description: 'Ben eats bananas',
        selected: true,
      });

      expect(() => listViewChecklist.getItem(100)).toThrowError(
        'No item exists at index 100.'
      );
    });

    it('should allow an item to be selected by index', () => {
      const fixture = TestBed.createComponent(TestComponent);

      fixture.componentInstance.selectMode = SELECT_MODE_SINGLE;

      fixture.detectChanges();

      const listViewChecklist = getChecklistFixture(fixture);

      listViewChecklist.selectItem(1);

      fixture.detectChanges();

      expect(fixture.componentInstance.selectedItems).toEqual([testItems[1]]);
    });

    it('should throw an error when deselecting an item', () => {
      const fixture = TestBed.createComponent(TestComponent);

      fixture.componentInstance.selectMode = SELECT_MODE_SINGLE;

      fixture.detectChanges();

      const listViewChecklist = getChecklistFixture(fixture);

      listViewChecklist.selectItem(1);

      fixture.detectChanges();

      expect(() => listViewChecklist.deselectItem(1)).toThrowError(
        'Items cannot be deselected in single select mode.'
      );
    });
  });
});
