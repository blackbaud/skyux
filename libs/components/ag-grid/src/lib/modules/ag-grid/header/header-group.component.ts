import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EnvironmentInjector,
  inject,
  viewChild,
  signal,
  computed,
  linkedSignal,
} from '@angular/core';
import {
  SkyDynamicComponentLocation,
  SkyDynamicComponentService,
} from '@skyux/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import { IHeaderGroupAngularComp } from 'ag-grid-angular';
import { ProvidedColumnGroup } from 'ag-grid-community';
import { EMPTY, switchMap } from 'rxjs';

import { fromGridEvent } from '../ag-grid-event-utils';
import { SkyAgGridHeaderGroupInfo } from '../types/header-group-info';
import { SkyAgGridHeaderGroupParams } from '../types/header-group-params';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

/**
 * @internal
 */
@Component({
  selector: 'sky-header-group',
  templateUrl: './header-group.component.html',
  styleUrls: ['./header-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyThemeModule, SkyIconModule, SkyI18nModule],
})
export class SkyAgGridHeaderGroupComponent
  implements IHeaderGroupAngularComp, AfterViewInit
{
  public readonly inlineHelpContainer = viewChild('inlineHelpContainer', {
    read: ElementRef,
  });

  protected readonly params = signal<SkyAgGridHeaderGroupParams | undefined>(
    undefined,
  );
  protected readonly isExpandable = computed(() =>
    this.#providedColumnGroup()?.isExpandable(),
  );
  protected readonly isExpanded = linkedSignal(() =>
    this.#providedColumnGroup()?.isExpanded(),
  );

  readonly #providedColumnGroup = computed<ProvidedColumnGroup | undefined>(
    () => this.params()?.columnGroup?.getProvidedColumnGroup(),
  );
  readonly #gridApi = toObservable(computed(() => this.params()?.api));
  readonly #columnGroupOpened = this.#gridApi.pipe(
    switchMap((api) => (api ? fromGridEvent(api, 'columnGroupOpened') : EMPTY)),
  );

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #dynamicComponentService = inject(SkyDynamicComponentService);
  readonly #environmentInjector = inject(EnvironmentInjector);

  constructor() {
    this.#columnGroupOpened.pipe(takeUntilDestroyed()).subscribe((event) => {
      const columnGroup = this.#providedColumnGroup();
      if (
        columnGroup &&
        columnGroup.isExpandable() &&
        event.columnGroups.includes(columnGroup)
      ) {
        this.isExpanded.set(columnGroup.isExpanded());
      }
    });
  }

  public ngAfterViewInit(): void {
    this.#updateInlineHelp();
    this.#changeDetector.markForCheck();
  }

  public agInit(params: SkyAgGridHeaderGroupParams | undefined): void {
    this.params.set(params);
    this.#updateInlineHelp();
    this.#changeDetector.markForCheck();
  }

  public setExpanded($event: boolean): void {
    this.params()?.setExpanded($event);
  }

  #updateInlineHelp(): void {
    const columnGroup = this.params()?.columnGroup;
    const colGroupDef = columnGroup?.getColGroupDef();
    const inlineHelpComponent =
      colGroupDef?.headerGroupComponentParams?.inlineHelpComponent;

    if (columnGroup && inlineHelpComponent) {
      const headerGroupInfo = new SkyAgGridHeaderGroupInfo();
      headerGroupInfo.columnGroup = columnGroup;
      headerGroupInfo.context = this.params()?.context;
      headerGroupInfo.displayName = this.params()?.displayName;

      this.#dynamicComponentService.createComponent(inlineHelpComponent, {
        providers: [
          {
            provide: SkyAgGridHeaderGroupInfo,
            useValue: headerGroupInfo,
          },
        ],
        environmentInjector: this.#environmentInjector,
        referenceEl: this.inlineHelpContainer()?.nativeElement,
        location: SkyDynamicComponentLocation.ElementBottom,
      });
    }
  }
}
