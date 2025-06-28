import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DOCUMENT,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  SkyAgGridRowDeleteConfirmArgs,
  SkyAgGridService,
  SkyCellType,
} from '@skyux/ag-grid';
import { SkyDockLocation, SkyDockService } from '@skyux/core';
import { SkyThemeService, SkyThemeSettings } from '@skyux/theme';

import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  RowSelectedEvent,
} from 'ag-grid-community';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { delay, filter, map } from 'rxjs/operators';

import { columnDefinitions, data } from '../shared/baseball-players-data';

import { ContextMenuComponent } from './context-menu.component';

interface DataSet {
  id: string;
  data: any[];
}

@Component({
  selector: 'app-ag-grid-stories',
  templateUrl: './ag-grid-stories.component.html',
  styleUrls: ['./ag-grid-stories.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class AgGridStoriesComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() public compact = false;

  public dataSets: DataSet[] = [
    {
      id: 'back-to-top',
      data: data.slice(40, 78),
    },
    {
      id: 'row-delete',
      data: data.slice(50, 53),
    },
    {
      id: 'validation',
      data: data.slice(60, 63),
    },
  ];
  public gridOptions: Record<string, GridOptions> = {};
  public isActive$ = new BehaviorSubject(true);
  public addPreviewWrapper$ = new BehaviorSubject(false);
  public ready = new BehaviorSubject(false);
  public rowDeleteIds: string[] = [];
  public skyTheme: SkyThemeSettings | undefined;

  readonly #gridsReady = new Map<string, Observable<boolean>>();
  readonly #gridsApi = new Map<string, GridApi>();
  readonly #agGridService: SkyAgGridService;
  readonly #themeSvc: SkyThemeService;
  readonly #changeDetectorRef: ChangeDetectorRef;
  readonly #dockService: SkyDockService;
  readonly #doc: Document;
  readonly #ngUnsubscribe: Subscription;

  constructor(
    agGridService: SkyAgGridService,
    themeSvc: SkyThemeService,
    changeDetectorRef: ChangeDetectorRef,
    dockService: SkyDockService,
    @Inject(DOCUMENT) doc: Document,
  ) {
    this.#agGridService = agGridService;
    this.#themeSvc = themeSvc;
    this.#changeDetectorRef = changeDetectorRef;
    this.#dockService = dockService;
    this.#doc = doc;
    this.#ngUnsubscribe = new Subscription();
  }

  public ngOnInit(): void {
    this.#dockService.setDockOptions({
      location: SkyDockLocation.ElementBottom,
      referenceEl: this.#doc.querySelector('#back-to-top') as HTMLElement,
    });
    this.dataSets.forEach((dataSet) =>
      this.#gridsReady.set(dataSet.id, new BehaviorSubject(false)),
    );
    this.#gridsReady.set(
      'theme',
      this.#themeSvc.settingsChange.pipe(map(() => true)),
    );
    this.#ngUnsubscribe.add(
      this.#themeSvc.settingsChange.subscribe((settings) => {
        this.skyTheme = settings.currentSettings;
        this.isActive$.next(true);
      }),
    );
    this.dataSets.forEach((dataSet) => {
      this.gridOptions[dataSet.id] = this.#agGridService.getGridOptions({
        gridOptions: {
          columnDefs: [
            ...((): (ColDef | ColGroupDef)[] =>
              dataSet.id === 'row-delete'
                ? [
                    {
                      field: 'select',
                      headerName: '',
                      sortable: false,
                      width: 30,
                      type: SkyCellType.RowSelector,
                    },
                    {
                      colId: 'contextMenu',
                      headerName: '',
                      sortable: false,
                      cellRenderer: ContextMenuComponent,
                      maxWidth: 55,
                    },
                  ]
                : [])(),
            ...columnDefinitions
              .slice(0, 10)
              .filter(
                (col) =>
                  col.field !== 'birthday' || dataSet.id !== 'validation',
              )
              .map((colDef) => {
                const additionalType =
                  colDef.field === 'seasons_played' &&
                  dataSet.id === 'validation'
                    ? [SkyCellType.NumberValidator]
                    : [];
                const cellRendererParams =
                  colDef.field === 'seasons_played' &&
                  dataSet.id === 'validation'
                    ? {
                        skyComponentProperties: {
                          validator: (value: unknown): boolean =>
                            !!value &&
                            typeof value === 'number' &&
                            value < 18 &&
                            value > 0,
                          validatorMessage:
                            'Expected a number between 1 and 18.',
                        },
                      }
                    : undefined;
                return {
                  ...colDef,
                  type: [
                    ...(Array.isArray(colDef.type)
                      ? colDef.type
                      : [colDef.type]),
                    ...additionalType,
                  ].filter((type) => !!type),
                  cellRendererParams,
                } as ColDef;
              }),
          ],
          context: {
            rowDeleteIds: [],
          },
          suppressColumnVirtualisation: true,
          suppressHorizontalScroll: true,
          suppressRowVirtualisation: true,
          alwaysShowHorizontalScroll: true,
          alwaysShowVerticalScroll: true,
          onGridReady: (params) => {
            this.#gridsApi.set(dataSet.id, params.api);
            if (dataSet.id === 'row-delete') {
              params.api.addEventListener(
                'rowSelected',
                ($event: RowSelectedEvent) => {
                  if ($event.node.id && $event.node.isSelected()) {
                    this.rowDeleteIds = this.rowDeleteIds.concat([
                      $event.node.id,
                    ]);
                  } else {
                    this.rowDeleteIds = this.rowDeleteIds.filter(
                      (id) => id !== $event.node.id,
                    );
                  }
                },
              );
            }
          },
          onFirstDataRendered: () => {
            (this.#gridsReady.get(dataSet.id) as BehaviorSubject<boolean>).next(
              true,
            );
          },
          rowData: dataSet.data,
        },
      });
    });
  }

  public ngAfterViewInit(): void {
    this.#ngUnsubscribe.add(
      combineLatest(Array.from(this.#gridsReady.values()))
        .pipe(
          filter((gridsReady) => gridsReady.every((ready) => ready)),
          delay(1000),
        )
        .subscribe(() => {
          // Scroll down to show the back-to-top button.
          this.#doc
            .querySelector(
              /* spell-checker: disable-next-line */
              '#back-to-top .sky-ag-grid-row-johnsra05 [col-id="name"]',
            )
            ?.scrollIntoView();

          setTimeout(() => {
            // Select a row to show the row delete button.
            this.#gridsApi.get('row-delete')?.setNodesSelected({
              nodes: [
                this.#gridsApi.get('row-delete')!.getRowNode('killeha01')!,
              ],
              newValue: true,
            });

            setTimeout(() => {
              // Trigger validation popover to show up.
              this.#gridsApi
                .get('validation')
                ?.setFocusedCell(1, 'seasons_played');

              // Tell Cypress we're ready.
              setTimeout(() => this.ready.next(true), 100);
            }, 300);
          }, 300);
        }),
    );
    if (!this.skyTheme) {
      this.isActive$.next(false);
      this.addPreviewWrapper$.next(true);
      setTimeout(() => {
        this.#changeDetectorRef.markForCheck();
      });
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.unsubscribe();
  }

  public deleteConfirm($event: SkyAgGridRowDeleteConfirmArgs): void {
    console.log(`Delete ${$event.id}`);
  }
}
