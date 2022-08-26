import {
  Component,
  HostBinding,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { SkyAgGridService, SkyCellType } from '@skyux/ag-grid';

import { GridOptions } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

import { columnDefinitions, data } from '../shared/baseball-players-data';

@Component({
  selector: 'app-ag-grid-stories',
  templateUrl: './ag-grid-stories.component.html',
  styleUrls: ['./ag-grid-stories.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgGridStoriesComponent implements OnInit {
  @HostBinding('class.use-normal-dom-layout')
  public get useNormalDomLayout(): boolean {
    return this.domLayout === 'normal';
  }

  @HostBinding('class.use-auto-height-dom-layout')
  public get useAutoHeightDomLayout(): boolean {
    return this.domLayout === 'autoHeight';
  }

  @Input()
  public domLayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';

  @Input()
  public enableTopScroll = true;

  @Input()
  public editable = true;

  public items = data;
  public gridOptions: GridOptions;
  public isActive$ = new BehaviorSubject(true);
  public ready = new BehaviorSubject(false);

  constructor(private agGridService: SkyAgGridService) {}

  public ngOnInit(): void {
    this.gridOptions = this.agGridService.getGridOptions({
      gridOptions: {
        columnDefs: [
          {
            field: 'select',
            headerName: '',
            width: 30,
            type: SkyCellType.RowSelector,
          },
          ...columnDefinitions,
        ].map((colDef) => {
          return {
            ...colDef,
            editable: this.editable,
          };
        }),
        context: {
          enableTopScroll: this.enableTopScroll,
        },
        domLayout: this.domLayout,
        onGridReady: () => {
          this.ready.next(true);
        },
      },
    });
  }
}
