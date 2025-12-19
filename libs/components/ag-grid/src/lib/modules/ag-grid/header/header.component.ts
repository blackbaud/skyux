import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  DestroyRef,
  ElementRef,
  EnvironmentInjector,
  Type,
  computed,
  inject,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  SkyDynamicComponentLocation,
  SkyDynamicComponentService,
} from '@skyux/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import { IHeaderAngularComp } from 'ag-grid-angular';
import { ColumnMovedEvent } from 'ag-grid-community';
import { Subscription, fromEvent, map, of, switchMap } from 'rxjs';

import { SkyAgGridHeaderInfo } from '../types/header-info';
import { SkyAgGridHeaderParams } from '../types/header-params';

/**
 * @internal
 */
@Component({
  selector: 'sky-ag-grid-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.title]': 'accessibleHeaderText()',
    '[attr.aria-label]': 'displayName() || accessibleHeaderText()',
    '[attr.role]': '"note"',
  },
  imports: [SkyHelpInlineModule, SkyI18nModule, SkyIconModule, SkyThemeModule],
})
export class SkyAgGridHeaderComponent
  implements IHeaderAngularComp, AfterViewInit
{
  public readonly filterEnabled = signal(false);

  // For accessibility, we need to set the title attribute on the header element if there is no visible header text.
  // https://dequeuniversity.com/rules/axe/4.5/empty-table-header?application=axeAPI
  protected readonly accessibleHeaderText = computed(() => {
    const params = this.params();
    if (
      params?.displayName &&
      !params?.column.getColDef().headerComponentParams?.headerHidden
    ) {
      return undefined;
    } else {
      return params?.displayName || params?.column.getColDef().field;
    }
  });

  protected readonly inlineHelpContainer = viewChild<ElementRef>(
    'inlineHelpContainer',
  );

  protected readonly params = signal<SkyAgGridHeaderParams | undefined>(
    undefined,
  );

  protected displayName = computed((): string => {
    const params = this.params();
    if (
      params?.displayName &&
      !params?.column.getColDef().headerComponentParams?.headerHidden
    ) {
      return params.displayName;
    } else {
      return '';
    }
  });

  protected readonly sortAriaLabel = computed(() => {
    const displayName = this.displayName();
    const accessibleHeaderText = this.accessibleHeaderText();
    return displayName || accessibleHeaderText;
  });

  protected readonly showInlineHelp = computed(
    () =>
      !!this.params()?.column.getColDef().headerComponentParams
        ?.helpPopoverContent,
  );

  #subscriptions = new Subscription();
  #inlineHelpComponentRef: ComponentRef<unknown> | undefined;
  #leftPosition = 0;

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #dynamicComponentService = inject(SkyDynamicComponentService);
  readonly #environmentInjector = inject(EnvironmentInjector);
  readonly #column = linkedSignal(() => this.params()?.column);
  readonly #gridApi = linkedSignal(() => this.params()?.api);
  readonly #gridSortColumns = toSignal(
    toObservable(this.#gridApi).pipe(
      switchMap((api) => {
        if (api) {
          return fromEvent(api, 'sortChanged').pipe(
            map(() =>
              api
                .getColumns()!
                .filter((column) => !!column.getSort())
                .map((column): string => column.getColId()),
            ),
          );
        }
        return of([]);
      }),
    ),
    { initialValue: [] },
  );

  protected readonly sortOrder = computed(() => {
    const colId = this.params()?.column.getColId();
    const enableSorting = !!this.params()?.enableSorting;
    this.#gridSortColumns();
    if (colId && enableSorting) {
      return this.params()?.column.getSort();
    }
    return undefined;
  });
  protected readonly sortIndexDisplay = computed(() => {
    const colId = this.params()?.column.getColId();
    const enableSorting = !!this.params()?.enableSorting;
    const sortIndex = this.params()?.column.getSortIndex() ?? false;
    const sortColumns = this.#gridSortColumns();
    if (
      enableSorting &&
      sortIndex !== false &&
      sortColumns.some((id) => id !== colId)
    ) {
      return `${sortIndex + 1}`;
    }
    return '';
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.#subscriptions.unsubscribe();
      this.#removeInlineHelpComponent();
    });
  }

  public ngAfterViewInit(): void {
    this.#updateInlineHelp();
  }

  public agInit(params: SkyAgGridHeaderParams | undefined): void {
    this.params.set(params);
    this.#subscriptions.unsubscribe();
    if (!params) {
      return;
    }
    this.#leftPosition = params.column.getLeft() ?? 0;
    this.#subscriptions = new Subscription();
    this.#subscriptions.add(
      fromEvent(params.api, 'gridPreDestroyed').subscribe(() => {
        this.#column.set(undefined);
        this.#gridApi.set(undefined);
        this.#subscriptions.unsubscribe();
      }),
    );
    if (params.column.isFilterAllowed()) {
      this.#subscriptions.add(
        fromEvent(params.column, 'filterChanged').subscribe(() =>
          this.filterEnabled.set(params.column.isFilterActive()),
        ),
      );
    }

    // When the column is moved left via the keyboard, the element is detached
    // and reattached to the DOM to maintain DOM order, and its focus is lost.
    this.#subscriptions.add(
      fromEvent<ColumnMovedEvent>(params.api, 'columnMoved').subscribe(
        (event) => {
          const left = event.column?.getLeft() ?? 0;
          const oldLeft = this.#leftPosition;
          if (
            event.column === params.column &&
            event.source === 'uiColumnMoved' &&
            left < oldLeft
          ) {
            params.eGridHeader.focus();
          }
          this.#leftPosition = left;
        },
      ),
    );

    this.#updateInlineHelp();
    this.#changeDetector.markForCheck();
  }

  public onMenuClick($event: Event): void {
    this.params()?.showColumnMenu($event.target as HTMLElement);
  }

  public onSortRequested(event: MouseEvent): void {
    if (this.params()?.enableSorting) {
      this.params()?.progressSort(event.shiftKey);
    }
  }

  public refresh(params: SkyAgGridHeaderParams): boolean {
    this.agInit(params);
    return false;
  }

  #updateInlineHelp(): void {
    const params = this.params();
    const inlineHelpContainer = this.inlineHelpContainer();
    if (!params || !inlineHelpContainer) {
      return;
    }
    const inlineHelpComponent =
      !params?.helpPopoverContent && params?.inlineHelpComponent;

    if (this.#shouldCreateInlineHelpComponent(inlineHelpComponent)) {
      this.#createInlineHelpComponent(params, inlineHelpComponent);
    } else if (!inlineHelpComponent) {
      this.#removeInlineHelpComponent();
    }
  }

  #shouldCreateInlineHelpComponent(
    inlineHelpComponent: Type<unknown> | undefined | false,
  ): inlineHelpComponent is Type<unknown> {
    return !!(
      inlineHelpComponent &&
      (!this.#inlineHelpComponentRef ||
        this.#inlineHelpComponentRef.componentType !== inlineHelpComponent)
    );
  }

  #createInlineHelpComponent(
    params: SkyAgGridHeaderParams | undefined,
    inlineHelpComponent: Type<unknown>,
  ): void {
    this.#removeInlineHelpComponent();

    const headerInfo = this.#createHeaderInfo(params);

    this.#inlineHelpComponentRef =
      this.#dynamicComponentService.createComponent(inlineHelpComponent, {
        providers: [
          {
            provide: SkyAgGridHeaderInfo,
            useValue: headerInfo,
          },
        ],
        environmentInjector: this.#environmentInjector,
        referenceEl: this.inlineHelpContainer()?.nativeElement,
        location: SkyDynamicComponentLocation.ElementBottom,
      });
  }

  #createHeaderInfo(
    params: SkyAgGridHeaderParams | undefined,
  ): SkyAgGridHeaderInfo {
    const headerInfo = new SkyAgGridHeaderInfo();
    headerInfo.column = params?.column;
    headerInfo.context = params?.context;
    headerInfo.displayName = params?.displayName;
    return headerInfo;
  }

  #removeInlineHelpComponent(): void {
    this.#dynamicComponentService.removeComponent(this.#inlineHelpComponentRef);
  }
}
