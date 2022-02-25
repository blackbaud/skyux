import { ICellEditorParams } from 'ag-grid-community';
import { SkyLookupProperties } from './lookup-properties';

export interface SkyCellEditorLookupParams extends ICellEditorParams {
  skyComponentProperties?: SkyLookupProperties;
}
