import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyCellRendererLookupParams } from '../../types/cell-renderer-lookup-params';

import { SkyAgGridCellRendererLookupComponent } from './cell-renderer-lookup.component';

describe('CellRendererLookupComponent', () => {
  let component: SkyAgGridCellRendererLookupComponent;
  let fixture: ComponentFixture<SkyAgGridCellRendererLookupComponent>;
  const params: Partial<SkyCellRendererLookupParams> = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    registerRowDragger(): void {},
    rowIndex: 0,
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
    component.agInit({ ...params } as SkyCellRendererLookupParams);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with value', () => {
    component.agInit({
      ...(params as SkyCellRendererLookupParams),
      value: [{ name: 'hello world' }],
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize with formatted value', () => {
    component.agInit({
      ...(params as SkyCellRendererLookupParams),
      valueFormatted: 'hello world',
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should refresh', () => {
    component.refresh({ ...params } as SkyCellRendererLookupParams);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
