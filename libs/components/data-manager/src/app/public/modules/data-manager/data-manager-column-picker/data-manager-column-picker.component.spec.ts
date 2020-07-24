import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyModalConfiguration,
  SkyModalHostService,
  SkyModalInstance
} from '@skyux/modals';

import {
  DataManagerFixtureModule
} from '../fixtures/data-manager.module.fixture';

import {
  SkyDataManagerColumnPickerComponent
} from './data-manager-column-picker.component';

import {
  SkyDataManagerColumnPickerContext
} from './data-manager-column-picker-context';

import {
  SkyDataManagerModule
} from '../../../public_api';

class MockModalInstance {
  public saveResult: any;
  public cancelResult: any;
  public closeResult: any;
  public closeReason: any;

  constructor() { }

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
    alwaysDisplayed: true,
    isSelected: true
  };

  const column2 = {
    id: '2',
    label: 'Column 2',
    isSelected: true
  };

  const column3 = {
    id: '3',
    label: 'Column 3',
    isSelected: false
  };

  const column4 = {
    id: '4',
    label: 'Column 4',
    isSelected: false
  };

  const columns = [ column1, column2, column3, column4 ];

  const modalContext: SkyDataManagerColumnPickerContext = {
    columnOptions: columns,
    displayedColumnIds: ['1', '2']
  };

  let dataManagerColumnPickerFixture: ComponentFixture<SkyDataManagerColumnPickerComponent>;
  let dataManagerColumnPickerComponent: SkyDataManagerColumnPickerComponent;
  let dataManagerColumnPickerElement: HTMLElement;
  let modalInstance: MockModalInstance;

  beforeEach(() => {
    modalInstance = new MockModalInstance();

    TestBed.configureTestingModule({
      imports: [
        DataManagerFixtureModule,
        SkyDataManagerModule
      ],
      providers: [
        {
          provide: SkyModalConfiguration,
          useValue: new MockModalConfiguration()
        },
        {
          provide: SkyModalHostService,
          useValue: new MockModalHostService()
        },
        {
          provide: SkyModalInstance,
          useValue: modalInstance
        },
        {
          provide: SkyDataManagerColumnPickerContext,
          useValue: modalContext
        }
      ]
    });

    dataManagerColumnPickerFixture = TestBed.createComponent(SkyDataManagerColumnPickerComponent);
    dataManagerColumnPickerElement = dataManagerColumnPickerFixture.nativeElement;
    dataManagerColumnPickerComponent = dataManagerColumnPickerFixture.componentInstance;

    dataManagerColumnPickerFixture.detectChanges();
  });

  describe('column search', () => {
    it('should return all columns when the data state search text is "col"', () => {
      dataManagerColumnPickerComponent.dataState.searchText = 'col';

      const searchResults = dataManagerColumnPickerComponent.searchColumns(columns);

      expect(searchResults).toEqual(columns);
    });

    it('should return column1 when the data state search text is "1"', () => {
      dataManagerColumnPickerComponent.dataState.searchText = '1';

      const searchResults = dataManagerColumnPickerComponent.searchColumns(columns);

      expect(searchResults).toEqual([column1]);
    });
  });

  it('should set all columns\'s isSelected property to true when selectAll is called', () => {
    dataManagerColumnPickerComponent.selectAll();

    dataManagerColumnPickerComponent.displayedColumnData.forEach(col => {
      expect(col.isSelected).toBeTrue();
    });
  });

  it('should set all columns\'s isSelected property to false when clearAll is called', () => {
    dataManagerColumnPickerComponent.clearAll();

    dataManagerColumnPickerComponent.displayedColumnData.forEach(col => {
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
    expect(dataManagerColumnPickerComponent.isSelected('2')).toBeTrue();
  });

  it('should filter unselected columns out of displayedColumnData if dataState.onlyShowSelected is true', () => {
    const dataState = dataManagerColumnPickerComponent.dataState;
    dataState.onlyShowSelected = true;

    expect(dataManagerColumnPickerComponent.displayedColumnData.length).toBe(3);

    dataManagerColumnPickerComponent.dataState = dataState;

    expect(dataManagerColumnPickerComponent.displayedColumnData.length).toBe(1);
    dataManagerColumnPickerComponent.displayedColumnData.forEach(col => {
      expect(col.isSelected).toBeTrue();
    });
  });

  it('should pass accessibility', async(() => {
    expect(dataManagerColumnPickerElement).toBeAccessible();
  }));
});
