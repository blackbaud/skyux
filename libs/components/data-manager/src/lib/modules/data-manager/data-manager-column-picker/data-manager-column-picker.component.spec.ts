import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyLibResourcesService } from '@skyux/i18n';

import {
  SkyModalConfiguration,
  SkyModalHostService,
  SkyModalInstance,
} from '@skyux/modals';

import { DataManagerFixtureModule } from '../fixtures/data-manager.module.fixture';

import { SkyDataManagerColumnPickerComponent } from './data-manager-column-picker.component';

import { SkyDataManagerColumnPickerContext } from './data-manager-column-picker-context';

import { SkyDataManagerColumnPickerSortStrategy } from '../../../public-api';

class MockModalInstance {
  public saveResult: any;
  public cancelResult: any;
  public closeResult: any;
  public closeReason: any;

  constructor() {}

  public save(result: any): void {
    this.saveResult = result;
  }

  public cancel(result: any): void {
    this.cancelResult = result;
  }

  public close(result: any, reason: string): void {
    this.closeResult = result;
    this.closeReason = reason;
  }
}

class MockModalHostService {
  constructor() {}

  public getModalZIndex(): void {}
  public onClose(): void {}
}

class MockModalConfiguration {
  public fullPage: boolean;

  constructor() {}
}

describe('SkyDataManagerColumnPickerComponent', () => {
  const column1 = {
    id: '1',
    label: 'Column 1',
    description: 'The first column.',
    alwaysDisplayed: true,
    isSelected: true,
  };

  const column2 = {
    id: '2',
    label: 'Column 2',
    description: 'The second column.',
    alwaysDisplayed: false,
    isSelected: false,
  };

  const column3 = {
    id: '3',
    label: 'Column 3',
    description: 'The third column.',
    alwaysDisplayed: false,
    isSelected: true,
  };

  const column4 = {
    id: '4',
    label: 'Column 4',
    description: 'The fourth column.',
    alwaysDisplayed: false,
    isSelected: false,
  };

  const columns = [column1, column2, column3, column4];

  const modalContext: SkyDataManagerColumnPickerContext = {
    columnOptions: columns,
    columnPickerSortStrategy:
      SkyDataManagerColumnPickerSortStrategy.SelectedThenAlphabetical,
    displayedColumnIds: ['1', '3'],
  };

  let dataManagerColumnPickerFixture: ComponentFixture<SkyDataManagerColumnPickerComponent>;
  let dataManagerColumnPickerComponent: SkyDataManagerColumnPickerComponent;
  let dataManagerColumnPickerElement: HTMLElement;
  let modalInstance: MockModalInstance;

  beforeEach(() => {
    modalInstance = new MockModalInstance();

    TestBed.configureTestingModule({
      imports: [DataManagerFixtureModule],
      providers: [
        {
          provide: SkyModalConfiguration,
          useValue: new MockModalConfiguration(),
        },
        {
          provide: SkyModalHostService,
          useValue: new MockModalHostService(),
        },
        {
          provide: SkyModalInstance,
          useValue: modalInstance,
        },
        {
          provide: SkyDataManagerColumnPickerContext,
          useValue: modalContext,
        },
      ],
    });

    dataManagerColumnPickerFixture = TestBed.createComponent(
      SkyDataManagerColumnPickerComponent
    );
    dataManagerColumnPickerElement =
      dataManagerColumnPickerFixture.nativeElement;
    dataManagerColumnPickerComponent =
      dataManagerColumnPickerFixture.componentInstance;

    dataManagerColumnPickerFixture.detectChanges();
  });

  describe('column search', () => {
    it(
      'should display the expected title',
      waitForAsync(() => {
        const libResources =
          dataManagerColumnPickerFixture.debugElement.injector.get(
            SkyLibResourcesService
          );

        libResources
          .getString('skyux_data_manager_column_picker_title')
          .subscribe((value) => {
            console.log(value);
          });

        expect(
          dataManagerColumnPickerElement.querySelector('sky-modal-header')
        ).toHaveText('Choose columns to show in the list');
      })
    );

    it('should return all columns when the data state search text is "col"', () => {
      dataManagerColumnPickerComponent.dataState.searchText = 'col';

      const searchResults =
        dataManagerColumnPickerComponent.searchColumns(columns);

      expect(searchResults).toEqual(columns);
    });

    it('should return all columns when the data state search text does not match casing', () => {
      dataManagerColumnPickerComponent.dataState.searchText = 'CoL';

      const searchResults =
        dataManagerColumnPickerComponent.searchColumns(columns);

      expect(searchResults).toEqual(columns);
    });

    it('should return column1 when the data state search text is "1"', () => {
      dataManagerColumnPickerComponent.dataState.searchText = '1';

      const searchResults =
        dataManagerColumnPickerComponent.searchColumns(columns);

      expect(searchResults).toEqual([column1]);
    });
  });

  it("should set all columns's isSelected property to true when selectAll is called", () => {
    dataManagerColumnPickerComponent.selectAll();

    dataManagerColumnPickerComponent.displayedColumnData.forEach((col) => {
      expect(col.isSelected).toBeTrue();
    });
  });

  it("should set all columns's isSelected property to false when clearAll is called", () => {
    dataManagerColumnPickerComponent.clearAll();

    dataManagerColumnPickerComponent.displayedColumnData.forEach((col) => {
      expect(col.isSelected).toBeFalse();
    });
  });

  it('should close the modal when the cancel button is clicked', () => {
    spyOn(modalInstance, 'cancel');

    dataManagerColumnPickerComponent.cancelChanges();

    expect(modalInstance.cancel).toHaveBeenCalled();
  });

  it('should save the modal and selected column data when the save button is clicked', () => {
    spyOn(modalInstance, 'save');

    dataManagerColumnPickerComponent.applyChanges();

    expect(modalInstance.save).toHaveBeenCalled();
  });

  it('isSelected() should return true for selected column ids', () => {
    expect(dataManagerColumnPickerComponent.isSelected('3')).toBeTrue();
  });

  it('should filter unselected columns out of displayedColumnData if dataState.onlyShowSelected is true', () => {
    const dataState = dataManagerColumnPickerComponent.dataState;
    dataState.onlyShowSelected = true;

    expect(dataManagerColumnPickerComponent.displayedColumnData.length).toBe(3);

    dataManagerColumnPickerComponent.dataState = dataState;

    expect(dataManagerColumnPickerComponent.displayedColumnData.length).toBe(1);
    dataManagerColumnPickerComponent.displayedColumnData.forEach((col) => {
      expect(col.isSelected).toBeTrue();
    });
  });

  it('should sort columns if column picker sorting is set to selected then alphabetical', () => {
    expect(dataManagerColumnPickerComponent.columnData).toEqual([
      column1,
      column3,
      column2,
      column4,
    ]);
  });

  it('should not sort columns if column picker sorting is set to none', () => {
    dataManagerColumnPickerFixture = TestBed.createComponent(
      SkyDataManagerColumnPickerComponent
    );
    dataManagerColumnPickerComponent =
      dataManagerColumnPickerFixture.componentInstance;
    dataManagerColumnPickerComponent.context.columnPickerSortStrategy =
      SkyDataManagerColumnPickerSortStrategy.None;
    dataManagerColumnPickerFixture.detectChanges();

    expect(dataManagerColumnPickerComponent.columnData).toEqual([
      column1,
      column2,
      column3,
      column4,
    ]);
  });

  it('should pass accessibility', async () => {
    await expectAsync(dataManagerColumnPickerElement).toBeAccessible();
  });
});
