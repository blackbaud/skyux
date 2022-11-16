import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { SkyAgGridService, SkyCellType } from '@skyux/ag-grid';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
} from '@skyux/theme';

import { ColDef, GridOptions } from 'ag-grid-community';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { delay, filter, map } from 'rxjs/operators';

import { columnDefinitions, data } from '../shared/baseball-players-data';
import { FontLoadingService } from '../shared/font-loading/font-loading.service';
import { InlineHelpComponent } from '../shared/inline-help/inline-help.component';

type DataSet = { id: string; data: any[] };

@Component({
  selector: 'app-data-entry-grid',
  templateUrl: './data-entry-grid.component.html',
  styleUrls: ['./data-entry-grid.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DataEntryGridComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  public variationId: 'date-and-lookup' | 'edit-lookup';

  /**
   * Allow for multiple scenarios to share this component to test e.g. different overlays.
   */
  @Input()
  public set variation(value: 'date-and-lookup' | 'edit-lookup') {
    this.variationId = value;
    const initialActive = this.isActive$.value;
    this.isActive$.next(false);
    switch (value) {
      case 'date-and-lookup':
        this.dataSets = [
          { id: 'editDateWithCalendar', data: data.slice(6, 15) },
          { id: 'editDate', data: data.slice(3, 6) },
          { id: 'editLookup', data: data.slice(0, 3) },
        ];
        break;
      case 'edit-lookup':
        this.dataSets = [
          { id: 'editText', data: data.slice(3, 6) },
          { id: 'editLookup', data: data.slice(6, 11) },
          { id: 'editLookupMultiple', data: data.slice(90, 95) },
          { id: 'sideScroll', data: data.slice(96, 99) },
        ];
    }
    this.isActive$.next(initialActive || this.isActive$.value);
    this.#changeDetectorRef.markForCheck();
  }

  public dataSets: DataSet[];
  public gridOptions: { [_: string]: GridOptions } = {};
  public isActive$ = new BehaviorSubject(true);
  public addPreviewWrapper$ = new BehaviorSubject(false);
  public ready = new BehaviorSubject(false);
  public skyTheme: SkyThemeSettings;

  readonly #gridsReady = new Map<string, Observable<boolean>>();
  #nameLookupData: { name: string; id: string }[];
  readonly #agGridService: SkyAgGridService;
  readonly #themeSvc: SkyThemeService;
  readonly #changeDetectorRef: ChangeDetectorRef;
  readonly #ngUnsubscribe: Subscription;
  readonly #fontLoadingService: FontLoadingService;

  constructor(
    agGridService: SkyAgGridService,
    themeSvc: SkyThemeService,
    changeDetectorRef: ChangeDetectorRef,
    fontLoadingService: FontLoadingService
  ) {
    this.#agGridService = agGridService;
    this.#themeSvc = themeSvc;
    this.#changeDetectorRef = changeDetectorRef;
    this.#ngUnsubscribe = new Subscription();
    this.#fontLoadingService = fontLoadingService;
  }

  public ngOnInit(): void {
    if (!this.dataSets) {
      this.variation = 'date-and-lookup';
    }
    this.#nameLookupData = data.map((player) => {
      return {
        id: player.id,
        name: player.name,
      };
    });
    this.dataSets.forEach((dataSet) =>
      this.#gridsReady.set(dataSet.id, new BehaviorSubject(false))
    );
    this.#gridsReady.set(
      'theme',
      this.#themeSvc.settingsChange.pipe(map(() => true))
    );
    this.#gridsReady.set('font', this.#fontLoadingService.ready());
    this.#ngUnsubscribe.add(
      this.#themeSvc.settingsChange.subscribe((settings) => {
        if (settings.currentSettings.theme.name === 'modern') {
          const editDateIndex = this.dataSets.findIndex(
            (ds) => ds.id === 'editDateWithCalendar'
          );
          if (editDateIndex > -1) {
            this.dataSets[editDateIndex].data = this.dataSets[
              editDateIndex
            ].data.slice(0, 7);
          }
        }
        this.skyTheme = settings.currentSettings;
        this.isActive$.next(true);
      })
    );
    this.dataSets.forEach((dataSet) => {
      let columnDefs: ColDef[];
      const tripleCrownIndex = columnDefinitions.findIndex(
        (col) => col.field === 'triplecrown'
      );
      switch (dataSet.id) {
        case 'sideScroll':
          columnDefs = columnDefinitions
            .slice(tripleCrownIndex, tripleCrownIndex + 3)
            .map((col) => {
              if (col.field === 'mvp') {
                col.headerComponentParams = {
                  inlineHelpComponent: InlineHelpComponent,
                };
                col.initialSort = 'desc';
              }
              return {
                ...col,
                editable: true,
              };
            });
          break;
        default:
          columnDefs = [
            ...columnDefinitions.slice(0, 5).map((colDef) => {
              if (
                dataSet.id.startsWith('editLookup') &&
                colDef.field === 'name'
              ) {
                return {
                  ...colDef,
                  editable: true,
                  type: SkyCellType.Lookup,
                  cellEditorParams: {
                    skyComponentProperties: {
                      data: this.#nameLookupData,
                      idProperty: 'id',
                      descriptorProperty: 'name',
                      selectMode: dataSet.id.endsWith('Multiple')
                        ? 'multiple'
                        : 'single',
                    },
                  },
                  cellRendererParams: {
                    skyComponentProperties: {
                      descriptorProperty: 'name',
                    },
                  },
                };
              }
              return {
                ...colDef,
                editable: true,
              };
            }),
          ];
      }
      this.gridOptions[dataSet.id] = this.#agGridService.getGridOptions({
        gridOptions: {
          columnDefs,
          stopEditingWhenCellsLoseFocus: false,
          suppressColumnVirtualisation: true,
          suppressHorizontalScroll: true,
          suppressRowVirtualisation: true,
          onFirstDataRendered: () => {
            (this.#gridsReady.get(dataSet.id) as BehaviorSubject<boolean>).next(
              true
            );
          },
          rowData: (() => {
            if (dataSet.id.startsWith('editLookup')) {
              return dataSet.data.map((player) => {
                return {
                  ...player,
                  name: [
                    {
                      id: player.id,
                      name: player.name,
                    },
                  ],
                };
              });
            }
            return dataSet.data;
          })(),
        },
      });
    });
  }

  public ngAfterViewInit(): void {
    this.#ngUnsubscribe.add(
      combineLatest(Array.from(this.#gridsReady.values()))
        .pipe(
          filter((gridsReady) => gridsReady.every((ready) => ready)),
          delay(1000)
        )
        .subscribe(() => this.ready.next(true))
    );
    if (!this.isActive$.value) {
      setTimeout(() => {
        this.skyTheme = new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light
        );
        this.#changeDetectorRef.markForCheck();
      });
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.unsubscribe();
  }
}
