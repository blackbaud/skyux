import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import {
  SkyModalConfiguration,
  SkyModalHostService,
  SkyModalInstance,
} from '@skyux/modals';

import { GridReadyEvent } from 'ag-grid-community';

import { SkyChartDataPoint } from '../shared/types/chart-data-point';
import { SkyChartSeries } from '../shared/types/chart-series';

import { SkyChartGridModalContext } from './chart-data-grid-modal-context';
import { SkyChartDataGridModalComponent } from './chart-data-grid-modal.component';

describe('SkyChartDataGridModalComponent', () => {
  function setupTest(options?: {
    modalTitle?: string;
    series?: SkyChartSeries<SkyChartDataPoint>[];
  }): {
    fixture: ComponentFixture<SkyChartDataGridModalComponent>;
    mockInstance: jasmine.SpyObj<SkyModalInstance>;
  } {
    const context = new SkyChartGridModalContext({
      modalTitle: options?.modalTitle ?? 'Chart data',
      series: options?.series ?? series,
    });

    const mockInstance = jasmine.createSpyObj<SkyModalInstance>(
      'SkyModalInstance',
      ['close', 'save', 'cancel'],
    );

    TestBed.configureTestingModule({
      imports: [SkyChartDataGridModalComponent],
      providers: [
        { provide: SkyChartGridModalContext, useValue: context },
        { provide: SkyModalInstance, useValue: mockInstance },
        { provide: SkyModalHostService, useValue: {} },
        { provide: SkyModalConfiguration, useValue: {} },
      ],
    });

    const fixture = TestBed.createComponent(SkyChartDataGridModalComponent);
    fixture.detectChanges();

    return { fixture, mockInstance };
  }

  it('should pass accessibility', async () => {
    const { fixture } = setupTest();

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  describe('rendering', () => {
    it('should display the provided modal title', () => {
      const { fixture } = setupTest({ modalTitle: 'My Chart Data' });

      expect(fixture.componentInstance.title).toBe('My Chart Data');
    });

    it('should render the close button', () => {
      const { fixture } = setupTest();

      const closeButton: HTMLButtonElement | null =
        fixture.nativeElement.querySelector('sky-modal-footer .sky-btn-link');

      expect(closeButton).not.toBeNull();
    });

    it('should render the ag-grid wrapper', () => {
      const { fixture } = setupTest();

      expect(
        fixture.nativeElement.querySelector('sky-ag-grid-wrapper'),
      ).not.toBeNull();
    });

    it('should render the ag-grid component', () => {
      const { fixture } = setupTest();

      expect(
        fixture.nativeElement.querySelector('ag-grid-angular'),
      ).not.toBeNull();
    });
  });

  describe('close behavior', () => {
    it('should call instance.close() when close() is called', () => {
      const { fixture, mockInstance } = setupTest();

      fixture.componentInstance.close();

      expect(mockInstance.close).toHaveBeenCalled();
    });

    it('should call instance.close() when the close button is clicked', () => {
      const { fixture, mockInstance } = setupTest();

      const closeButton: HTMLButtonElement =
        fixture.nativeElement.querySelector('sky-modal-footer .sky-btn-link');
      closeButton.click();
      fixture.detectChanges();

      expect(mockInstance.close).toHaveBeenCalled();
    });
  });

  describe('grid configuration', () => {
    it('should build gridOptions with a column for each series plus a category column', () => {
      const { fixture } = setupTest();

      const gridOptions = fixture.componentInstance['gridOptions'];
      const columnDefs = gridOptions.columnDefs as { field: string }[];

      // One category column + one per series
      expect(columnDefs.length).toBe(3);
      expect(columnDefs[0].field).toBe('category');
      expect(columnDefs[1].field).toBe('series_0');
      expect(columnDefs[2].field).toBe('series_1');
    });

    it('should build rowData with one row per category', () => {
      const { fixture } = setupTest();

      const gridOptions = fixture.componentInstance['gridOptions'];
      const rowData = gridOptions.rowData as { category: string }[];

      expect(rowData.length).toBe(3);
      expect(rowData.map((r) => r.category)).toEqual(['Q1', 'Q2', 'Q3']);
    });

    it('should populate row data with series values for each category', () => {
      const { fixture } = setupTest();

      const gridOptions = fixture.componentInstance['gridOptions'];
      const rowData = gridOptions.rowData as {
        category: string;
        series_0: string;
        series_1: string;
      }[];

      const q1Row = rowData.find((r) => r.category === 'Q1');
      expect(q1Row?.['series_0']).toBe('$100');
      expect(q1Row?.['series_1']).toBe('$80');
    });

    it('should use empty string when a category has no data point in a series', () => {
      const partialSeries: SkyChartSeries<SkyChartDataPoint>[] = [
        {
          id: 1,
          labelText: 'Revenue',
          data: [
            { id: 1, labelText: '$100', category: 'Q1' },
            { id: 2, labelText: '$200', category: 'Q2' },
          ],
        },
        {
          id: 2,
          labelText: 'Expenses',
          data: [
            { id: 3, labelText: '$80', category: 'Q1' },
            // Q2 intentionally missing from this series
          ],
        },
      ];
      const { fixture } = setupTest({ series: partialSeries });

      const gridOptions = fixture.componentInstance['gridOptions'];
      const rowData = gridOptions.rowData as {
        category: string;
        series_0: string;
        series_1: string;
      }[];

      const q2Row = rowData.find((r) => r.category === 'Q2');
      expect(q2Row?.['series_0']).toBe('$200');
      expect(q2Row?.['series_1']).toBe('');
    });

    it('should handle empty series gracefully', () => {
      const { fixture } = setupTest({ series: [] });

      const gridOptions = fixture.componentInstance['gridOptions'];
      const columnDefs = gridOptions.columnDefs as { field: string }[];
      const rowData = gridOptions.rowData as unknown[];

      expect(columnDefs.length).toBe(1); // only category column
      expect(rowData.length).toBe(0);
    });

    it('should call sizeColumnsToFit when the grid is ready', () => {
      const { fixture } = setupTest();

      const mockApi = jasmine.createSpyObj('GridApi', ['sizeColumnsToFit']);
      const { onGridReady } = fixture.componentInstance['gridOptions'];
      onGridReady?.({ api: mockApi } as unknown as GridReadyEvent);

      expect(mockApi.sizeColumnsToFit).toHaveBeenCalled();
    });
  });
});

// #region Test Data
const series: SkyChartSeries<SkyChartDataPoint>[] = [
  {
    id: 1,
    labelText: 'Revenue',
    data: [
      { id: 1, labelText: '$100', category: 'Q1' },
      { id: 2, labelText: '$200', category: 'Q2' },
      { id: 3, labelText: '$150', category: 'Q3' },
    ],
  },
  {
    id: 2,
    labelText: 'Expenses',
    data: [
      { id: 4, labelText: '$80', category: 'Q1' },
      { id: 5, labelText: '$120', category: 'Q2' },
      { id: 6, labelText: '$90', category: 'Q3' },
    ],
  },
];
// #endregion
