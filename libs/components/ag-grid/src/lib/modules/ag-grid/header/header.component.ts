import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  EnvironmentInjector,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  SkyDynamicComponentLocation,
  SkyDynamicComponentService,
} from '@skyux/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import { IHeaderAngularComp } from 'ag-grid-angular';
import { EMPTY, switchMap } from 'rxjs';

import { fromGridEvent } from '../ag-grid-event-utils';
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
  imports: [SkyIconModule, SkyThemeModule, SkyI18nModule],
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

  protected readonly inlineHelpContainer = viewChild('inlineHelpContainer', {
    read: ElementRef,
  });

  protected readonly params = signal<SkyAgGridHeaderParams | undefined>(
    undefined,
  );
  protected sorted = '';
  protected readonly sortOrder = linkedSignal<'asc' | 'desc' | undefined>(
    () => this.params()?.column.getSort() || undefined,
  );
  protected readonly sortIndexDisplay = linkedSignal(() =>
    this.#computeSortIndexDisplay(),
  );

  protected displayName = computed<string | undefined>(() => {
    const params = this.params();
    if (
      params?.displayName &&
      !params?.column.getColDef().headerComponentParams?.headerHidden
    ) {
      return params.displayName;
    } else {
      return undefined;
    }
  });

  #inlineHelpComponentRef: ComponentRef<unknown> | undefined;
  #viewInitialized = false;
  #agInitialized = false;
  #leftPosition = 0;

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #dynamicComponentService = inject(SkyDynamicComponentService);
  readonly #environmentInjector = inject(EnvironmentInjector);

  readonly #paramsChanges = toObservable(this.params);
  readonly #sortChanged = this.#paramsChanges.pipe(
    switchMap((params) =>
      params?.enableSorting && params.api
        ? fromGridEvent(params.api, 'sortChanged')
        : EMPTY,
    ),
  );
  readonly #columnMoved = this.#paramsChanges.pipe(
    switchMap((params) =>
      params?.api ? fromGridEvent(params.api, 'columnMoved') : EMPTY,
    ),
  );

  constructor() {
    // Column filter state changes
    effect((onCleanup) => {
      const column = this.params()?.column;
      if (!column?.isFilterAllowed()) {
        return;
      }
      const handler = (): void =>
        this.filterEnabled.set(column.isFilterActive());
      column.addEventListener('filterChanged', handler);
      onCleanup(() => column.removeEventListener('filterChanged', handler));
    });

    // Column sort state changes
    effect((onCleanup) => {
      const params = this.params();
      if (!params?.enableSorting) {
        return;
      }
      const column = params.column;
      const handler = (): void =>
        this.sortOrder.set(column.getSort() || undefined);
      column.addEventListener('sortChanged', handler);
      onCleanup(() => column.removeEventListener('sortChanged', handler));
    });

    // Other column sort state changes, for multi-column sorting
    this.#sortChanged.pipe(takeUntilDestroyed()).subscribe(() => {
      this.sortIndexDisplay.set(this.#computeSortIndexDisplay());
    });

    // When the column is moved left via the keyboard, the element is detached
    // and reattached to the DOM to maintain DOM order, and its focus is lost.
    this.#columnMoved.pipe(takeUntilDestroyed()).subscribe((event) => {
      const params = this.params();
      const left = event.column?.getLeft() ?? 0;
      const oldLeft = this.#leftPosition;
      if (
        params &&
        event.column === params.column &&
        event.source === 'uiColumnMoved' &&
        left < oldLeft
      ) {
        params.eGridHeader.focus();
      }
      this.#leftPosition = left;
    });
  }

  public ngAfterViewInit(): void {
    this.#viewInitialized = true;
    this.#updateInlineHelp();
  }

  public agInit(params: SkyAgGridHeaderParams | undefined): void {
    this.#agInitialized = true;
    this.params.set(params);
    this.#leftPosition = params?.column.getLeft() ?? 0;
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
    if (!this.#viewInitialized || !this.#agInitialized) {
      return;
    }

    const inlineHelpComponent = this.params()?.inlineHelpComponent;

    if (
      inlineHelpComponent &&
      (!this.#inlineHelpComponentRef ||
        this.#inlineHelpComponentRef.componentType !== inlineHelpComponent)
    ) {
      this.#dynamicComponentService.removeComponent(
        this.#inlineHelpComponentRef,
      );

      const headerInfo = new SkyAgGridHeaderInfo();
      headerInfo.column = this.params()?.column;
      headerInfo.context = this.params()?.context;
      headerInfo.displayName = this.params()?.displayName;

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
    } else if (!inlineHelpComponent) {
      this.#dynamicComponentService.removeComponent(
        this.#inlineHelpComponentRef,
      );
    }
  }

  #computeSortIndexDisplay(): string {
    const params = this.params();
    const sortIndex = params?.column.getSortIndex();
    const otherSortColumns = params?.api
      ?.getColumns()
      ?.some(
        (column) =>
          column.getColId() !== params?.column.getColId() && !!column.getSort(),
      );
    return sortIndex !== undefined && sortIndex !== null && otherSortColumns
      ? `${sortIndex + 1}`
      : '';
  }
}
