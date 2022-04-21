import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@skyux-sdk/testing';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule } from '@skyux/lookup';

import { Column } from 'ag-grid-community';
import { EventCallback } from 'typedoc/dist/lib/utils/events';

import { SkyCellEditorLookupParams } from '../../types/cell-editor-lookup-params';

import { SkyAgGridCellEditorLookupComponent } from './cell-editor-lookup.component';

describe('SkyAgGridCellEditorLookupComponent', () => {
  let component: SkyAgGridCellEditorLookupComponent;
  let fixture: ComponentFixture<SkyAgGridCellEditorLookupComponent>;
  let callback: EventCallback | undefined;
  const params: SkyCellEditorLookupParams = {
    api: undefined,
    cellStartedEdit: false,
    charPress: undefined,
    colDef: {
      headerName: 'header',
    },
    column: {
      getActualWidth: () => 123,
      addEventListener: (event: string, listener: EventCallback) => {
        callback = listener;
        [event].pop();
      },
    } as Column,
    columnApi: undefined,
    context: undefined,
    data: undefined,
    eGridCell: undefined,
    formatValue(): any {},
    key: undefined,
    eventKey: undefined,
    node: undefined,
    onKeyDown(): void {},
    parseValue(): any {},
    rowIndex: 0,
    skyComponentProperties: {
      data: [],
    },
    stopEditing(): void {},
    value: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkyAgGridCellEditorLookupComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        SkyInputBoxModule,
        SkyLookupModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    callback = undefined;
    fixture = TestBed.createComponent(SkyAgGridCellEditorLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.getGui()).toBeTruthy();
    expect(component.getValue()).toEqual([]);
    expect(component.getValue()).toBeTruthy();
    expect(component.isPopup()).toBeTrue();
    expect(component.isCancelAfterEnd()).toBeFalse();
  });

  it('should initialize with empty value', () => {
    component.agInit({ ...params });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with value', () => {
    component.agInit({
      ...params,
      value: [{ name: 'hello world' }],
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with disabled control', () => {
    component.agInit({
      ...params,
      skyComponentProperties: {
        ...params.skyComponentProperties,
        disabled: true,
      },
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should throw error with invalid value', () => {
    try {
      component.agInit({
        ...params,
        value: false,
      });
      fail(`should have thrown an error`);
    } catch (e) {
      expect(e.message).toBe('Lookup value must be an array');
    }
  });

  it('should maintain column width', () => {
    component.agInit({ ...params });
    fixture.detectChanges();
    expect(component.width).toBe(123);
    expect(callback).toBeTruthy();
    callback({
      column: {
        getActualWidth: () => 456,
      } as Column,
    });
    expect(component.width).toBe(456);
  });
});
