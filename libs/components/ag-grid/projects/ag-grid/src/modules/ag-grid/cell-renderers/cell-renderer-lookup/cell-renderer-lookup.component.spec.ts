import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyAgGridCellRendererLookupComponent } from './cell-renderer-lookup.component';

describe('CellRendererLookupComponent', () => {
  let component: SkyAgGridCellRendererLookupComponent;
  let fixture: ComponentFixture<SkyAgGridCellRendererLookupComponent>;
  const params = {
    $scope: undefined,
    api: undefined,
    columnApi: undefined,
    context: undefined,
    data: undefined,
    eGridCell: undefined,
    eParentOfValue: undefined,
    node: undefined,
    registerRowDragger(): void {},
    rowIndex: 0,
    value: undefined,
    valueFormatted: undefined,
    skyComponentProperties: {
      data: [],
      descriptorProperty: 'name',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkyAgGridCellRendererLookupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkyAgGridCellRendererLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should initialize with formatted value', () => {
    component.agInit({
      ...params,
      valueFormatted: 'hello world',
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should refresh', () => {
    component.refresh({ ...params });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
