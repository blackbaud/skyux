import {
  TestBed
} from '@angular/core/testing';

import {
  Component
} from '@angular/core';

import {
  By
} from '@angular/platform-browser';

import {
  SkyListModule,
  SkyListToolbarModule
} from '@skyux/list-builder';

import {
  SkyListViewGridModule
} from '@skyux/list-builder-view-grids';

import {
  Observable,
  of as observableOf
} from 'rxjs';

import {
  SkyListViewGridFixture
} from './list-view-grid-fixture';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const testItems = [
  { id: '1', column1: 101, column2: 'Apple', column3: 'Anne eats apples'},
  { id: '2', column1: 202, column2: 'Banana', column3: 'Ben eats bananas' },
  { id: '3', column1: 303, column2: 'Pear', column3: 'Patty eats pears' },
  { id: '4', column1: 404, column2: 'Grape', column3: 'George eats grapes' },
  { id: '5', column1: 505, column2: 'Banana', column3: 'Becky eats bananas' },
  { id: '6', column1: 606, column2: 'Lemon', column3: 'Larry eats lemons' },
  { id: '7', column1: 707, column2: 'Strawberry', column3: 'Sally eats strawberries' }
];

//#region Test component
@Component({
  selector: 'list-view-checklist-test',
  template: `
<sky-list [data]="items" [defaultView]="grid">
  <sky-list-toolbar>
  </sky-list-toolbar>
  <sky-list-view-grid
    fit="scroll"
    data-sky-id="my-list-view-grid"
    #grid
  >
    <sky-grid-column
      field="column1"
      heading="Column 1"
      [locked]="true"
    >
    </sky-grid-column>
    <sky-grid-column
      field="column2"
      heading="Column 2"
    >
    </sky-grid-column>
    <sky-grid-column
      heading="Link"
      [template]="linkTemplate"
    >
    </sky-grid-column>
  </sky-list-view-grid>
</sky-list>
<ng-template
  let-row="row"
  let-value="value"
  #linkTemplate
>
  <a class="my-grid-link" [href]="'/test/' + row.id">
    {{ row.column2 }}
  </a>
</ng-template>
  `
})
class TestComponent {
  public items: Observable<Array<any>> = observableOf(testItems);
}
//#endregion Test component

describe('List view grid fixture', () => {
  let listViewGrid: SkyListViewGridFixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent
      ],
      imports: [
        SkyListModule,
        SkyListViewGridModule,
        SkyListToolbarModule,
        NoopAnimationsModule
      ]
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    listViewGrid = new SkyListViewGridFixture(
      fixture,
      'my-list-view-grid'
    );
  });

  it('should allow a row to be retrieved by index', () => {
    const validateRow = (
      index: number,
      cell1Text: string,
      cell2Text: string,
      linkUrl: string,
      linkText: string
    ) => {
      const row = listViewGrid.getRow(index);

      expect(row.cells[0].textContent).toBe(cell1Text);
      expect(row.cells[1].textContent).toBe(cell2Text);

      const linkCell = row.cells[2];

      const linkEl = linkCell.el.query(By.css('.my-grid-link'));

      expect(linkEl.nativeElement.getAttribute('href')).toBe(linkUrl);
      expect(linkEl.nativeElement.innerText.trim()).toBe(linkText);
    };

    validateRow(0, '101', 'Apple', '/test/1', 'Apple');
    validateRow(1, '202', 'Banana', '/test/2', 'Banana');

    expect(
      () => listViewGrid.getRow(100)
    ).toThrowError('No row exists at index 100.');
  });

  it('should count amount of rows', () => {
    expect(listViewGrid.getRowCount()).toBe(testItems.length);
  });

  it('should allow a header to be retrieved by index', () => {
    const validateHeader = (
      columnIndex: number,
      locked: boolean,
      textContent: string
    ) => {
      let header = listViewGrid.getHeader(columnIndex);

      expect(header.locked).toBe(locked);
      expect(header.textContent).toBe(textContent);
    };

    validateHeader(0, true, 'Column 1');
    validateHeader(1, false, 'Column 2');
    validateHeader(2, false, 'Link');

    expect(
      () => listViewGrid.getHeader(100)
    ).toThrowError('No column exists at index 100.');
  });

  it('should count amount of headers', () => {
    expect(listViewGrid.getHeaderCount()).toBe(3);
  });
});
