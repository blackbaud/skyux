import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  ICellEditorAngularComp
} from 'ag-grid-angular';

import {
  ICellEditorParams
} from 'ag-grid-community';

@Component({
  selector: 'sky-ag-grid-cell-editor-autocomplete',
  templateUrl: './cell-editor-autocomplete.component.html',
  styleUrls: ['./cell-editor-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyAgGridCellEditorAutocompleteComponent implements ICellEditorAngularComp, OnInit {
  public currentSelection: any;
  public autocompleteInputLabel: string;

  public data: any[] = [];
  public debounceTime: number;
  public descriptorProperty: string;
  public propertiesToSearch: string[];
  public search: (searchText: string, data?: any[]) => any[] | Promise<any[]>;
  public searchFilters: (searchText: string, item: any) => boolean;
  public searchResultsLimit: number;
  public searchResultTemplate: string;
  public searchTextMinimumCharacters: number;
  public selectionChange: Function;

  public columnWidth: number;
  public rowHeight: number;
  public columnHeader: string;
  public rowNumber: number;
  private params: ICellEditorParams;

  @ViewChild('skyCellEditorAutocomplete', {read: ElementRef})
  public input: ElementRef;

  constructor(private libResources: SkyLibResourcesService) { }

  public agInit(params: ICellEditorParams) {
    this.params = params;
    this.currentSelection = this.params.value;
    this.columnWidth = this.params.column && this.params.column.getActualWidth();
    this.rowHeight = this.params.node && this.params.node.rowHeight + 1;
    this.columnHeader = this.params.colDef && this.params.colDef.headerName;
    this.rowNumber = this.params.rowIndex + 1;

    const cellEditorParams = this.params.colDef.cellEditorParams;
    if (cellEditorParams) {
      this.data = cellEditorParams.data;
      this.debounceTime = cellEditorParams.debounceTime;
      this.descriptorProperty = cellEditorParams.descriptorProperty;
      this.propertiesToSearch = cellEditorParams.propertiesToSearch;
      this.search = cellEditorParams.search;
      this.searchFilters = cellEditorParams.searchFilters;
      this.searchResultsLimit = cellEditorParams.searchResultsLimit;
      this.searchResultTemplate = cellEditorParams.searchResultTemplate;
      this.searchTextMinimumCharacters = cellEditorParams.searchTextMinimumCharacters;
      this.selectionChange = cellEditorParams.selectionChange;
    }
  }

  public ngOnInit(): void {
    this.libResources.getString('sky_ag_grid_cell_editor_autocomplete_aria_label', this.columnHeader, this.rowNumber)
    .subscribe(label => {
      this.autocompleteInputLabel = label;
    });
  }

  public afterGuiAttached(): void {
    this.input.nativeElement.focus();
  }

  public getValue(): any {
    return this.currentSelection;
  }

  public isPopup(): boolean {
    return true;
  }
}
